import os
from Crypto.Cipher import AES
from dotenv import load_dotenv
from Crypto.Protocol.KDF import scrypt
import binascii

load_dotenv()  # Load environment variables from .env file

def unpad(s):
    return s[:-ord(s[len(s)-1:])] 
# Create a function to decrypt a string encrypted with AES-256-CBC with a key and a IV store as a string in the .env file
def decrypt_data(data):
    # Get the key and the IV from the .env file
    key = os.getenv("KEY")
    iv = os.getenv("IV")
