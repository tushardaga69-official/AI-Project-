async function predict() {
    const btn = document.getElementById("predict-btn");
    const outputBox = document.getElementById("output-box");
    const resultText = document.getElementById("result");
    const insightText = document.getElementById("insight");

    // UI Feedback
    btn.innerText = "Analyzing...";
    btn.disabled = true;
    
    // Clear past classes
    outputBox.classList.remove("show", "alert-error", "alert-success");
    outputBox.style.display = "none";

    const data = {
        date: document.getElementById("date").value,
        store_id: Number(document.getElementById("store_id").value || 0),
        sku_id: Number(document.getElementById("sku_id").value || 0),
        base_price: Number(document.getElementById("base_price").value || 0),
        total_price: Number(document.getElementById("total_price").value || 0),
        featured: document.getElementById("featured").checked ? 1 : 0,
        display: document.getElementById("display").checked ? 1 : 0
    };

    try {
        const res = await fetch("/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await res.json();

        // Reveal Output Box
        outputBox.style.display = "block";
        outputBox.classList.add("show");

        if (result.error) {
            outputBox.classList.add("alert-error");
            resultText.innerText = "Processing Error";
            insightText.innerText = result.error;
        } else {
            outputBox.classList.add("alert-success");
            resultText.innerText = "Forecast: " + result.prediction + " units";
            insightText.innerText = result.insight;
        }

    } catch (err) {
        outputBox.style.display = "block";
        outputBox.classList.add("show", "alert-error");
        resultText.innerText = "Network Failure";
        insightText.innerText = err;
    } finally {
        // Reset Button
        btn.innerText = "Generate Forecast";
        btn.disabled = false;
    }
}