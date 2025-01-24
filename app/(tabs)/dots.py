from flask import Flask, request, jsonify
from PIL import Image
import numpy as np
from scipy.ndimage import label

app = Flask(__name__)

@app.route('/process-image', methods=['POST'])
def process_image():
    # Save uploaded image
    file = request.files['image']
    image = Image.open(file).convert('L')  # Convert to grayscale

    # Convert to numpy array
    img_array = np.array(image)

    # Threshold the image (convert to binary)
    binary_img = (img_array < 128).astype(int)

    # Label connected components (clusters)
    labeled_array, num_features = label(binary_img)

    return jsonify({'num_dots': num_features})

if __name__ == '__main__':
    app.run(debug=True)
