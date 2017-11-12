from flask import Flask, send_from_directory
app = Flask(__name__)

@app.route('/<path:path>')
def startup(path):
    return send_from_directory('.', path)