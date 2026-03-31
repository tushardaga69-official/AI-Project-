```python
from flask import Flask, request, jsonify, render_template, redirect, session
import pickle
import pandas as pd
import numpy as np
import psycopg2
import os
import re

app = Flask(__name__)
app.secret_key = "secret123"

# Load model
model = pickle.load(open('model.pkl', 'rb'))

# ---------- DATABASE ----------

def get_db():
    return psycopg2.connect(os.getenv("DATABASE_URL"))

def init_db():
    try:
        conn = get_db()
        cur = conn.cursor()
        cur.execute('''
            CREATE TABLE IF NOT EXISTS predictions (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255),
                store_id INT,
                sku_id INT,
                prediction INT,
                insight TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        conn.commit()
        cur.close()
        conn.close()
    except Exception as e:
        print("DB Init Error:", e)

init_db()

# ---------- CONTEXT PROCESSOR ----------
@app.context_processor
def inject_alert_count():
    if 'user' in session:
        try:
            conn = get_db()
            cur = conn.cursor()
            cur.execute(
                "SELECT COUNT(*) FROM predictions WHERE username=%s AND (prediction > 100 OR prediction < 50)",
                (session['user'],)
            )
            count = cur.fetchone()[0]
            cur.close()
            conn.close()
            return dict(alert_count=count)
        except:
            return dict(alert_count=0)
    return dict(alert_count=0)

# ---------- AUTH ROUTES ----------

@app.route('/')
def home():
    return redirect('/login')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        u = request.form.get('username')
        p = request.form.get('password')

        conn = get_db()
        cur = conn.cursor()
        cur.execute("SELECT * FROM users WHERE username=%s AND password=%s", (u, p))
        user = cur.fetchone()
        cur.close()
        conn.close()

        if user:
            session['user'] = u
            return redirect('/dashboard')
        return render_template('login.html', error="Invalid Access Credentials ❌")

    return render_template('login.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        u = request.form.get('username')
        p = request.form.get('password')

        pattern = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
        if not re.match(pattern, p):
            return render_template('signup.html', error="Password must be strong.")

        try:
            conn = get_db()
            cur = conn.cursor()
            cur.execute("INSERT INTO users (username, password) VALUES (%s, %s)", (u, p))
            conn.commit()
            cur.close()
            conn.close()
            return redirect('/login')
        except:
            return render_template('signup.html', error="Username exists or DB error.")

    return render_template('signup.html')

@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect('/login')

# ---------- APP ROUTES ----------

@app.route('/dashboard')
def dashboard():
    if 'user' not in session:
        return redirect('/login')
    return render_template('dashboard.html')

@app.route('/settings')
def settings_page():
    if 'user' not in session:
        return redirect('/login')
    return render_template('settings.html')

@app.route('/reports')
def reports_page():
    if 'user' not in session:
        return redirect('/login')

    history = []
    try:
        conn = get_db()
        cur = conn.cursor()
        cur.execute(
            "SELECT * FROM predictions WHERE username=%s ORDER BY created_at DESC LIMIT 50",
            (session['user'],)
        )
        rows = cur.fetchall()
        history = [
            {
                "id": r[0],
                "username": r[1],
                "store_id": r[2],
                "sku_id": r[3],
                "prediction": r[4],
                "insight": r[5],
                "created_at": r[6]
            } for r in rows
        ]
        cur.close()
        conn.close()
    except Exception as e:
        print("Reports error:", e)

    return render_template('reports.html', history=history)

@app.route('/alerts')
def alerts_page():
    if 'user' not in session:
        return redirect('/login')

    alerts = []
    try:
        conn = get_db()
        cur = conn.cursor()
        cur.execute(
            "SELECT * FROM predictions WHERE username=%s AND (prediction > 100 OR prediction < 50) ORDER BY created_at DESC",
            (session['user'],)
        )
        rows = cur.fetchall()
        alerts = [
            {
                "id": r[0],
                "prediction": r[4],
                "insight": r[5],
                "created_at": r[6]
            } for r in rows
        ]
        cur.close()
        conn.close()
    except Exception as e:
        print("Alerts error:", e)

    return render_template('alerts.html', alerts=alerts)

@app.route('/predict-page')
def predict_page():
    if 'user' not in session:
        return redirect('/login')
    return render_template('predict.html')

@app.route('/api/dashboard-stats')
def dashboard_stats():
    if 'user' not in session:
        return jsonify({"error": "Unauthorized"}), 401

    try:
        conn = get_db()
        cur = conn.cursor()

        cur.execute(
            "SELECT prediction, created_at FROM predictions WHERE username=%s ORDER BY created_at DESC LIMIT 10",
            (session['user'],)
        )
        trend_rows = cur.fetchall()
        trend_rows.reverse()

        cur.execute("SELECT prediction FROM predictions WHERE username=%s", (session['user'],))
        all_preds = cur.fetchall()

        cur.close()
        conn.close()

        trend_labels = [row[1].strftime('%b %d, %H:%M') if row[1] else '' for row in trend_rows]
        trend_data = [row[0] for row in trend_rows]

        low_risk = stable = overstock_risk = 0
        hist_bins = [0, 0, 0, 0, 0]

        for p in all_preds:
            val = p[0]
            if val < 50: low_risk += 1
            elif val > 100: overstock_risk += 1
            else: stable += 1

            if val <= 25: hist_bins[0] += 1
            elif val <= 50: hist_bins[1] += 1
            elif val <= 75: hist_bins[2] += 1
            elif val <= 100: hist_bins[3] += 1
            else: hist_bins[4] += 1

        return jsonify({
            "trend": {"labels": trend_labels, "data": trend_data},
            "pie": {"data": [overstock_risk, stable, low_risk]},
            "histogram": {"data": hist_bins}
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---------- ML LOGIC ----------

columns = [
    'store_id','sku_id','total_price','base_price',
    'is_featured_sku','is_display_sku',
    'year','month','day','week_of_year',
    'discount_amount','discount_percent'
]

def preprocess(data):
    d = pd.to_datetime(data['date'])
    discount_amount = data['base_price'] - data['total_price']
    discount_percent = (discount_amount / data['base_price']) * 100 if data['base_price'] > 0 else 0

    df = pd.DataFrame({
        'store_id':[data['store_id']],
        'sku_id':[data['sku_id']],
        'total_price':[data['total_price']],
        'base_price':[data['base_price']],
        'is_featured_sku':[data['featured']],
        'is_display_sku':[data['display']],
        'year':[d.year],
        'month':[d.month],
        'day':[d.day],
        'week_of_year':[int(d.isocalendar().week)],
        'discount_amount':[discount_amount],
        'discount_percent':[discount_percent]
    })
    return df[columns]

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        df = preprocess(data)
        pred = int(model.predict(df)[0])

        if pred > 100:
            insight = "High demand anticipated."
        elif pred > 50:
            insight = "Moderate demand forecasted."
        else:
            insight = "Low demand projected."

        if 'user' in session:
            conn = get_db()
            cur = conn.cursor()
            cur.execute("""
                INSERT INTO predictions (username, store_id, sku_id, prediction, insight)
                VALUES (%s, %s, %s, %s, %s)
            """, (session['user'], data.get('store_id', 0), data.get('sku_id', 0), pred, insight))
            conn.commit()
            cur.close()
            conn.close()

        return jsonify({"prediction": pred, "insight": insight})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
```
