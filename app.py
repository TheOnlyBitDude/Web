from flask import Flask, render_template
import os

app = Flask(__name__)

@app.route('/')
def home():
    return render_template("index.html", title="A.")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 9128))
    app.run(host="0.0.0.0", port=port, debug=True)
