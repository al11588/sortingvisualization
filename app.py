from flask import Flask, render_template, url_for, request, jsonify, send_file
from pymongo import MongoClient
from datetime import datetime, timezone
from bson import json_util
import json
import atexit
import signal
import sys
import csv
import io

app = Flask(__name__, static_folder='static')

# Let's get our MongoDB ready!
client = MongoClient('mongodb://localhost:27017/')
db = client['sorting_visualization']
history_collection = db['sorting_history']

# Time to clean up when we're done
def cleanup_handler(signum=None, frame=None):
    try:
        history_collection.delete_many({})
        print("\nAll done! Cleared the sorting history for a fresh start.")
    except Exception as e:
        print(f"Oops! Had some trouble clearing the history: {e}")
    if signum is not None:  # If called as signal handler
        sys.exit(0)

# Register our cleanup for different shutdown scenarios
signal.signal(signal.SIGINT, cleanup_handler)  # Handle Ctrl+C
signal.signal(signal.SIGTERM, cleanup_handler)  # Handle termination
atexit.register(cleanup_handler)  # Regular Python exit

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
            'timestamp': datetime.now(timezone.utc),  # Use timezone-aware timestamp
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

@app.route('/api/export/json')
def export_json():
    try:
        # Get all history entries
        history_entries = list(history_collection.find().sort('timestamp', -1))
        
        # Format the entries
        formatted_entries = []
        for entry in history_entries:
            entry['_id'] = str(entry['_id'])
            entry['timestamp'] = entry['timestamp'].strftime('%Y-%m-%d %H:%M:%S')
            formatted_entries.append(entry)
        
        # Create the JSON response
        return jsonify(formatted_entries)
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/export/csv')
def export_csv():
    try:
        # Get all history entries
        history_entries = list(history_collection.find().sort('timestamp', -1))
        
        # Create a StringIO object to write CSV data
        si = io.StringIO()
        writer = csv.writer(si)
        
        # Write headers
        writer.writerow(['Timestamp', 'Algorithm', 'Initial Array', 'Sorted Array'])
        
        # Write data rows
        for entry in history_entries:
            writer.writerow([
                entry['timestamp'].strftime('%Y-%m-%d %H:%M:%S'),
                entry['algorithm'],
                ', '.join(map(str, entry['initial_array'])),
                ', '.join(map(str, entry['sorted_array']))
            ])
        
        # Create the response
        output = si.getvalue()
        si.close()
        
        # Create a response with CSV data
        return send_file(
            io.BytesIO(output.encode('utf-8')),
            mimetype='text/csv',
            as_attachment=True,
            download_name='sorting_history.csv'
        )
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    try:
        app.run(debug=True)
    finally:
        # Make extra sure we clean up
        cleanup_handler() 