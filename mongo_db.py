from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

def get_db():
    client = MongoClient(f"{os.getenv('MONGO_HOST')}:{os.getenv('MONGO_PORT')}")
    
    db = client.get_database("automatAPI")

    collection = db.get_collection("pruebas")
    
    print(collection.find_one())
    client.close()


if __name__ == '__main__':
    get_db()