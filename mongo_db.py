import pprint
import time
from pymongo import MongoClient, collection, results, cursor
from dotenv import load_dotenv
import os


def get_collection(db_name: str, collection_name: str) -> collection.Collection:
    """
        @params db_name: name of the database to connect
        @params collection_name: name of the collection to connect
        @return collection object: the collection object to work with
    """

    load_dotenv()
    client = MongoClient(f"{os.getenv('MONGO_HOST')}:{os.getenv('MONGO_PORT')}")
    
    db = client.get_database(db_name)
    collection = db.get_collection(collection_name)
    
    return collection

def insert_one(collection: collection.Collection, data: dict) -> results.InsertOneResult:
    """
        @params collection: collection object to work with
        @params data: data to insert in the collection

        @return InsertOneResult: the result of the insert (if return acknowledgement is False, the data is not inserted)
    """
    return collection.insert_one(data)

def insert_many(collection: collection.Collection, data: list) -> results.InsertManyResult:
    """
        @params collection: collection object to work with
        @params data: data to insert in the collection

        @return InsertManyResult: the result of the insert (if return acknowledgement is False, the data is not inserted)
    """
    return collection.insert_many(data)

def find_one(collection: collection.Collection, id: str) -> dict:
    """
        @params collection: collection object to work with
        @params id: id of the data to find
        @return data: data found
    """
    data = collection.find_one({"_id": id})

    return data

def find_many(collection: collection.Collection, query: dict) -> cursor.Cursor:
    """
        @params collection: collection object to work with
        @params query: query to find the data
        @return data: data found
    """
    data = collection.find(query)

    return data

def update_one(collection: collection.Collection, id: str, data: dict) -> results.UpdateResult:
    """
        @params collection: collection object to work with
        @params query: query to find the data
        @params data: data to update (if return acknowledgement is False, the data is not inserted)

        @return UpdateResult: the result of the update (if return acknowledgement is False, the data is not inserted)
    """
    return collection.update_one({"_id":id}, {"$set": data})

def update_many(collection: collection.Collection, query: dict, data: dict) -> results.UpdateResult:
    """
        @params collection: collection object to work with
        @params query: query to find the data
        @params data: data to update

        @return UpdateResult: the result of the update (if return acknowledgement is False, the data is not inserted)
    """
    return collection.update_many(query, data)

def delete_one(collection: collection.Collection, id: str) -> results.DeleteResult:
    """
        @params collection: collection object to work with
        @params query: query to find the data

        @return DeleteResult: the result of the delete (if return acknowledgement is False, the data is not inserted)
    """
    return collection.delete_one({"_id": id})

def delete_many(collection: collection.Collection, query: dict) -> results.DeleteResult:
    """
        @params collection: collection object to work with
        @params query: query to find the data

        @return DeleteResult: the result of the delete (if return acknowledgement is False, the data is not inserted)
    """
    return collection.delete_many(query)


if __name__ == '__main__':
    # A simple test of the unitary functions
    collect = get_collection("automatAPI", "pruebas")

    # Insert one
    a = insert_one(collect, {"nombre": "prueba", "apellido": "prueba", "edad": 20})
    if(a.acknowledged):
        print("Correctly inserted")
        # Update of the inserted data
        b = update_one(collect, a.inserted_id, {"custom_obj": {"prop1": "Examp1", "prop2": "Examp2", "prop3": [1, 3, [41,56,"Examp5"], 412, {"prop4": "Examp4"}]}})
        if(b.acknowledged):
            print("Correctly updated")
            # Promt the data modifed
            pprint.pprint(find_one(collect, a.inserted_id))

            time.sleep(5)
            # Delete the data
            c = delete_one(collect, a.inserted_id)
            if(c.acknowledged):
                print("Correctly deleted")
    else:
        print("Not inserted")
        
