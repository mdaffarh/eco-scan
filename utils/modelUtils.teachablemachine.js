import * as tf from '@tensorflow/tfjs';

let model = null;
let labels = [];

/**
 * CARA SETUP MODEL:
 * ================
 * 1. Buka Teachable Machine project Anda
 * 2. Klik "Export Model"
 * 3. Pilih "Upload my model" untuk mendapatkan URL
 * 4. Copy URL dan paste di variable MODEL_URL di bawah
 * 
 * ATAU
 * 
 * 1. Export model dalam format "TensorFlow.js"
 * 2. Download file .zip
 * 3. Extract dan copy semua file ke folder public/model/
 * 4. Ubah MODEL_URL = '/model/model.json'
 */

// TODO: Ganti dengan URL Teachable Machine Anda
const MODEL_URL = 'https://teachablemachine.withgoogle.com/models/YOUR_MODEL_ID/';

/**
 * Load model TensorFlow.js dari Teachable Machine
 */
export async function loadModel() {
  try {
    console.log('Loading model from Teachable Machine...');
    
    // Load model dari URL (cloud hosted)
    const modelURL = MODEL_URL + 'model.json';
    const metadataURL = MODEL_URL + 'metadata.json';
    
    model = await tf.loadLayersModel(modelURL);
    console.log('Model loaded successfully');
    
    // Load metadata untuk mendapatkan labels
    const metadataResponse = await fetch(metadataURL);
    const metadata = await metadataResponse.json();
    labels = metadata.labels;
    
    console.log('Labels loaded:', labels);

    return { success: true };
  } catch (error) {
    console.error('Error loading model:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Preprocess image untuk model Teachable Machine
 * Input: 224x224 RGB, normalized to [0, 1]
 */
function preprocessImage(imageElement) {
  return tf.tidy(() => {
    // Convert image ke tensor
    let tensor = tf.browser.fromPixels(imageElement);
    
    // Resize ke 224x224 (standard untuk Teachable Machine)
    tensor = tf.image.resizeBilinear(tensor, [224, 224]);
    
    // Normalize ke range [0, 1]
    tensor = tensor.div(255.0);
    
    // Add batch dimension [1, 224, 224, 3]
    tensor = tensor.expandDims(0);
    
    return tensor;
  });
}

/**
 * Run prediction pada gambar
 * @param {HTMLImageElement} imageElement - Element gambar HTML
 * @returns {Promise<Object>} Hasil prediksi dengan label dan confidence
 */
export async function predictImage(imageElement) {
  if (!model) {
    throw new Error('Model belum di-load. Panggil loadModel() terlebih dahulu.');
  }

  try {
    console.log('Running prediction...');
    
    // Preprocess image
    const tensor = preprocessImage(imageElement);
    
    // Run inference
    const predictions = model.predict(tensor);
    
    // Get prediction data as array
    const predictionData = await predictions.data();
    
    // Clean up tensors
    tensor.dispose();
    predictions.dispose();

    // Find class dengan confidence tertinggi
    let maxIndex = 0;
    let maxValue = predictionData[0];
    
    for (let i = 1; i < predictionData.length; i++) {
      if (predictionData[i] > maxValue) {
        maxValue = predictionData[i];
        maxIndex = i;
      }
    }

    const confidence = (maxValue * 100).toFixed(2);
    const label = labels[maxIndex];

    console.log('Prediction result:', { label, confidence });

    // Return hasil dengan semua probabilitas
    return {
      label,
      confidence: parseFloat(confidence),
      allPredictions: labels.map((label, i) => ({
        label,
        confidence: (predictionData[i] * 100).toFixed(2)
      })).sort((a, b) => b.confidence - a.confidence) // Sort by confidence desc
    };
  } catch (error) {
    console.error('Error during prediction:', error);
    throw error;
  }
}

/**
 * Get kategori dan informasi disposal berdasarkan label
 */
export function getWasteInfo(label) {
  const wasteInfoMap = {
    'Organik': {
      category: 'Organik',
      icon: '🌿',
      color: '#4caf50',
      disposal: 'Buang ke tempat sampah organik/hijau. Dapat dikompos untuk pupuk.',
      additionalInfo: 'Sampah organik dapat terurai secara alami dan bisa dijadikan kompos yang berguna untuk tanaman.'
    },
    'Non Organik Daur Ulang': {
      category: 'Non Organik',
      icon: '♻️',
      color: '#2196f3',
      disposal: 'Buang ke tempat sampah non organik/biru. Pisahkan untuk daur ulang.',
      additionalInfo: 'Bersihkan terlebih dahulu sebelum dibuang untuk memudahkan proses daur ulang.'
    },
    'Botol Plastik': {
      category: 'Daur Ulang',
      icon: '🍾',
      color: '#ffa726',
      disposal: 'Cuci bersih, lepas tutup dan label, lalu buang ke tempat sampah plastik.',
      additionalInfo: 'Botol plastik dapat didaur ulang menjadi berbagai produk baru. Pastikan bersih dan kering.'
    },
    'Kertas': {
      category: 'Daur Ulang',
      icon: '📄',
      color: '#8d6e63',
      disposal: 'Buang ke tempat sampah kertas. Pastikan kertas dalam kondisi kering.',
      additionalInfo: 'Kertas basah atau terkontaminasi makanan sebaiknya dibuang ke sampah organik.'
    },
    'Residu': {
      category: 'Residu',
      icon: '🗑️',
      color: '#757575',
      disposal: 'Buang ke tempat sampah residu/hitam. Tidak dapat didaur ulang.',
      additionalInfo: 'Sampah residu adalah sampah yang tidak dapat didaur ulang dan tidak dapat terurai dengan cepat.'
    }
  };

  return wasteInfoMap[label] || {
    category: 'Unknown',
    icon: '❓',
    color: '#9e9e9e',
    disposal: 'Silakan hubungi petugas untuk informasi lebih lanjut.',
    additionalInfo: 'Label tidak dikenali dalam sistem.'
  };
}

/**
 * Check apakah model sudah di-load
 */
export function isModelLoaded() {
  return model !== null;
}
