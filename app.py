from flask import Flask, render_template, url_for, request, jsonify
from pymongo import MongoClient
from datetime import datetime
from bson import json_util
import json
import atexit
import signal
import sys

app = Flask(__name__, static_folder='static')

# Let's get our MongoDB ready!
client = MongoClient('mongodb://localhost:27017/')
db = client['sorting_visualization']
history_collection = db['sorting_history']

# Time to clean up when we're done
def clear_history():
    try:
        history_collection.delete_many({})
        print("All done! Cleared the sorting history for a fresh start.")
    except Exception as e:
        print(f"Oops! Had some trouble clearing the history: {e}")

# Handle different types of shutdowns
def signal_handler(sig, frame):
    print("\nCleaning up before shutdown...")
    clear_history()
    sys.exit(0)

# Register our cleanup for different shutdown scenarios
signal.signal(signal.SIGINT, signal_handler)  # Handle Ctrl+C
signal.signal(signal.SIGTERM, signal_handler)  # Handle termination
atexit.register(clear_history)  # Regular Python exit

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/settings')
def settings():
    return render_template('settings.html')

@app.route('/history')
def history():
    # Let's grab the last 10 sorting adventures, newest first!
    history_entries = list(history_collection.find().sort('timestamp', -1).limit(10))
    
    # Time to make these entries look nice for display
    formatted_entries = []
    for entry in history_entries:
        # Convert that pesky ObjectId to a string
        entry['_id'] = str(entry['_id'])
        # Make the timestamp look pretty
        entry['timestamp'] = entry['timestamp'].strftime('%Y-%m-%d %H:%M:%S')
        # Turn those arrays into nice, readable strings
        entry['initial_array'] = ', '.join(map(str, entry['initial_array']))
        entry['sorted_array'] = ', '.join(map(str, entry['sorted_array']))
        formatted_entries.append(entry)
    
    return render_template('history.html', history=formatted_entries)

@app.route('/api/save-sort', methods=['POST'])
def save_sort():
    try:
        data = request.get_json()
        # Let's record this sorting achievement!
        entry = {
            'timestamp': datetime.utcnow(),
            'algorithm': data['algorithm'],
            'initial_array': data['initial_array'],
            'sorted_array': data['sorted_array']
        }
        history_collection.insert_one(entry)
        return jsonify({'status': 'success'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/clear-history', methods=['POST'])
def clear_history_endpoint():
    try:
        history_collection.delete_many({})
        return jsonify({'status': 'success'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    try:
        app.run(debug=True)
    finally:
        # Make extra sure we clean up
        clear_history() 