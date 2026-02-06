from flask import Flask, request, jsonify, render_template
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# simple in-memory chat history
chat_history = []


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message")

    # store user message
    chat_history.append({
        "role": "user",
        "content": user_message
    })

    # mock AI reply (NO API needed)
    reply = f"[MOCK RESPONSE] You said: {user_message} | Total messages: {len(chat_history)}"

    # store assistant reply
    chat_history.append({
        "role": "assistant",
        "content": reply
    })

    return jsonify({"reply": reply})


if __name__ == "__main__":
    app.run(port=5001, debug=True)
# Server is good
