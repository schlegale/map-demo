import os
from datetime import datetime
from flask import Flask, request, jsonify
from supabase import create_client, Client
from dotenv import load_dotenv
load_dotenv()
app = Flask(__name__)

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Missing SUPABASE_URL or SUPABASE_KEY in environment variables")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@app.route('/', methods=['GET'])
def home():
    return jsonify({"status": "success", "message": "Backend is running"}), 200

# ==========================================
# USER AUTHENTICATION ROUTES
# ==========================================

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    email = data.get('email', '').strip()
    password = data.get('password', '')
    username = data.get('username', '').strip()
    birth_date = data.get('birthDate', '').strip()

    if not all([email, password, username, birth_date]):
        return jsonify({"error": "Email, password, gamertag, and birth date are required"}), 400

    try:
        # 1. Verify Age (Must be 18+)
        birth_date_obj = datetime.strptime(birth_date, '%Y-%m-%d')
        today = datetime.today()
        age = today.year - birth_date_obj.year - ((today.month, today.day) < (birth_date_obj.month, birth_date_obj.day))
        
        if age < 18:
            return jsonify({"error": "You must be at least 18 years old to play!"}), 400

        # 2. Check if Username is already taken
        existing_user = supabase.table('users').select('username').ilike('username', username).execute()
        if existing_user.data:
            return jsonify({"error": "That Gamertag is already taken! Try another one."}), 400

        # 3. Register user in Supabase Auth
        response = supabase.auth.sign_up({
            "email": email,
            "password": password
        })
        
        # 4. Save the extra profile info to our custom 'users' table
        if response.user:
            supabase.table('users').insert({
                "id": response.user.id,
                "username": username,
                "email": email,
                "birth_date": birth_date
            }).execute()

        return jsonify({
            "user": response.user.model_dump() if response.user else None
        }), 201

    except ValueError:
        return jsonify({"error": "Invalid date format. Use YYYY-MM-DD."}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    identifier = data.get('identifier', '').strip()
    password = data.get('password', '')

    if not identifier or not password:
        return jsonify({"error": "Login ID and password are required"}), 400

    try:
        email_to_login = identifier

        if '@' not in identifier:
            user_res = supabase.table('users').select('email').ilike('username', identifier).execute()
            if not user_res.data:
                return jsonify({"error": f"Gamertag '{identifier}' not found! Check spelling."}), 404
            email_to_login = user_res.data[0]['email']

        response = supabase.auth.sign_in_with_password({
            "email": email_to_login,
            "password": password
        })
        
        return jsonify({
            "access_token": response.session.access_token,
            "user": response.user.model_dump()
        }), 200
    except Exception as e:
        return jsonify({"error": "Invalid password or credentials."}), 401

# ==========================================
# DATABASE ROUTES (PostgreSQL)
# ==========================================

@app.route('/users', methods=['GET'])
def get_users():
    try:
        response = supabase.table('users').select("*").execute()
        return jsonify(response.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)