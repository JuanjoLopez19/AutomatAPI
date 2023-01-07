import psycopg2
from psycopg2 import extensions,errors, sql
import os
from dotenv import load_dotenv

def get_db() -> extensions.connection:
    """
        @params None: None
        @return connection: connection to the database
        Connect to the database
    """
    try:
        load_dotenv()
        conn = psycopg2.connect(f"dbname={os.getenv('PG_DATABASE')} user={os.getenv('PG_USER')} password={os.getenv('PG_PASSWORD')}")
        return conn
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
        return None    
    
def close_db(conn: extensions.connection) -> None:
    """
        @params conn: connection to the database
        @return None: close the connection to the database
    """
    conn.close()

def select_all_users(conn: extensions.connection) -> list:
    """
        @params conn: connection to the database
        @return data: data found
    """
    data = []
    try:
        cur = conn.cursor()
        cur.execute("SELECT * FROM users")
        data = cur.fetchall()
        cur.close()
    except (Exception, psycopg2.DatabaseError, errors.UndefinedTable) as error:
        print(error)
    return data

def select_user_by_id(conn: extensions.connection, id: int) -> tuple:
    """
        @params conn: connection to the database
        @params id: id of the data to find
        @return data: data found
    """
    data = []
    try:
        cur = conn.cursor()
        cur.execute("SELECT * FROM users WHERE id = %s", (id,))
        data = cur.fetchone()
        cur.close()
    except (Exception, psycopg2.DatabaseError, errors.UndefinedTable) as error:
        print(error)
    return data

def select_all_templates(conn: extensions.connection) -> list:
    """
        @params conn: connection to the database
        @return data: data found
    """

    try:
        cur = conn.cursor()
        cur.execute("SELECT * FROM templates")
        data = cur.fetchall()
        cur.close()
    except (Exception, psycopg2.DatabaseError, errors.UndefinedTable) as error:
        print(error)
    return data

def select_template_by_id(conn: extensions.connection, id: int) -> tuple:
    """
        @params conn: connection to the database
        @params id: id of the data to find
        @return data: data found
    """
    data = []
    try:
        cur = conn.cursor()
        cur.execute("SELECT * FROM templates WHERE id = %s", (id,))
        data = cur.fetchall()
        cur.close()
    except (Exception, psycopg2.DatabaseError, errors.UndefinedTable) as error:
        print(error)
    return data
    

if __name__ == '__main__':
    con = get_db()
    if con:
        print("Connection successful")
        a = select_user_by_id(con, 3)
        print(a)
        