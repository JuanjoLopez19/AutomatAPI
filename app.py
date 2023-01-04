from flask import Flask, jsonify
from aux_methods import *



api = Flask(__name__)

@api.route('/')
def index():
    return jsonify({'message': DEFAULT_CONFIG})

if __name__ == '__main__':
    api.run(debug=True)