from flask import Flask, request, jsonify, render_template
import pickle
import pandas as pd
import numpy as np

app = Flask(__name__)

# Load model
model = pickle.load(open('model.pkl', 'rb'))

# ✅ Column order (VERY IMPORTANT 🔥)
columns = [
    'store_id', 'sku_id', 'total_price', 'base_price',
    'is_featured_sku', 'is_display_sku',
    'year', 'month', 'day', 'week_of_year',
    'discount_amount', 'discount_percent'
]

# ✅ UI route
@app.route('/ui')
def ui():
    return render_template('index.html')

# ✅ Home route
@app.route('/')
def home():
    return "🚀 AI Demand Forecasting API is running!"

# ✅ Preprocessing
def preprocess_input(data):
    date_obj = pd.to_datetime(data['date'])

    discount_amount = data['base_price'] - data['total_price']
    discount_percent = (
        (discount_amount / data['base_price']) * 100
        if data['base_price'] > 0 else 0
    )

    df = pd.DataFrame({
        'store_id': [data['store_id']],
        'sku_id': [data['sku_id']],
        'total_price': [data['total_price']],
        'base_price': [data['base_price']],
        'is_featured_sku': [data['featured']],
        'is_display_sku': [data['display']],
        'year': [date_obj.year],
        'month': [date_obj.month],
        'day': [date_obj.day],
        'week_of_year': [int(date_obj.isocalendar().week)],
        'discount_amount': [discount_amount],
        'discount_percent': [discount_percent]
    })

    # 🔥 Ensure correct column order
    df = df[columns]

    return df


# ✅ Prediction API
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()

        # Validate input
        if not data:
            return jsonify({"error": "No input data provided"}), 400

        df = preprocess_input(data)

        prediction = max(0, int(np.round(model.predict(df)[0])))

        # Insight logic
        if prediction > 100:
            insight = "High demand expected. Increase stock."
        elif prediction > 50:
            insight = "Moderate demand."
        else:
            insight = "Low demand."

        return jsonify({
            "prediction": prediction,
            "insight": insight
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Run app
if __name__ == '__main__':
    app.run(debug=True)