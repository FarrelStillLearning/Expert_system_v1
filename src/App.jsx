import React, { useState } from 'react';
import './App.css';
import { symptoms as initialSymptoms, damageTypes, rules, getSolution } from './data/knowledgeBase';
import { inferDamage } from './utils/forwardChaining';

const App = () => {
  const [symptoms, setSymptoms] = useState(() => initialSymptoms.map(s => ({ ...s })));
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [result, setResult] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const toggleSymptom = (id) => {
    setSymptoms(prev => prev.map(symptom => 
      symptom.id === id ? { ...symptom, selected: !symptom.selected } : symptom
    ));
    
    setSelectedSymptoms(prev => 
      prev.includes(id) 
        ? prev.filter(s => s !== id) 
        : [...prev, id]
    );
  };

  const runForwardChaining = () => {
    const results = inferDamage(selectedSymptoms);
    setResult(results);
    setShowResults(true);
  };

  const resetDiagnosis = () => {
    setSymptoms(prev => prev.map(s => ({ ...s, selected: false })));
    setSelectedSymptoms([]);
    setResult(null);
    setShowResults(false);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 p-0 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Sistem Pakar Deteksi Kerusakan Jaringan Internet
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Metode Forward Chaining + Certainty Factor - Studi Kasus: Layanan Internet Diskominfotik Sumatera Barat
          </p>
          <div className="mt-4 bg-white rounded-lg shadow-md p-4 inline-block">
            <p className="text-xs sm:text-sm text-gray-500">
              Akurasi: <span className="font-bold text-green-600">100%</span> (berdasarkan penelitian)
            </p>
          </div>
        </div>

        {!showResults ? (
          <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6">
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
                Pilih Gejala Kerusakan
              </h2>
              <p className="text-gray-600 mb-4">
                Silakan pilih gejala-gejala kerusakan jaringan internet yang Anda alami:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {symptoms.map((symptom) => (
                  <div 
                    key={symptom.id}
                    className={`p-3 sm:p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      symptom.selected 
                        ? 'border-blue-500 bg-blue-50 shadow-inner' 
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                    onClick={() => toggleSymptom(symptom.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div 
                        className={`relative w-6 h-6 rounded-full border flex items-center justify-center ${
                          symptom.selected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                        }`}
                        style={{
                          minWidth: '24px',
                          minHeight: '24px',
                          maxWidth: '24px',
                          maxHeight: '24px',
                          boxSizing: 'border-box',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {symptom.selected && (
                          <svg 
                            className="w-4 h-4 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                            style={{ 
                              strokeWidth: '3',
                              width: '16px',
                              height: '16px'
                            }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                          </svg>
                        )}
                      </div>
                      
                      <div>
                        <span className="font-medium text-gray-800">{symptom.id}</span>
                        <p className="text-gray-700 text-sm mt-1">{symptom.name}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-500">
                {selectedSymptoms.length} gejala dipilih
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={resetDiagnosis}
                  className="py-2 px-4 sm:px-6 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={runForwardChaining}
                  disabled={selectedSymptoms.length === 0}
                  className={`py-2 px-4 sm:px-6 rounded-lg transition-colors ${
                    selectedSymptoms.length === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  Diagnosa Sekarang
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Hasil Diagnosa</h2>
            
            {result && result.length > 0 ? (
              <div>
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-800">Kerusakan Terdeteksi</h3>
                  <p className="text-green-700">
                    Berdasarkan gejala yang Anda pilih, sistem mendeteksi kerusakan sebagai berikut:
                  </p>
                </div>
                
                <div className="space-y-4">
                  {result.map((item, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start">
                        <div className="bg-red-100 text-red-800 rounded-lg p-3 mr-4">
                          <span className="font-bold">{item.id}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.name}</h3>
                          {/* Tambahkan baris untuk CF */}
                          <div className="mb-3">
                            <span className="text-sm font-medium text-gray-700">Tingkat Kepercayaan: </span>
                            <span className="text-sm font-bold text-blue-600">{(item.cf * 100).toFixed(1)}%</span>
                          </div>
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-sm font-medium text-blue-800 mb-1">Solusi:</p>
                            <p className="text-gray-700">{item.solution}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="text-5xl mb-4">🤔</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Tidak Ditemukan Kerusakan</h3>
                <p className="text-gray-600 mb-6">
                  Berdasarkan gejala yang Anda pilih, sistem tidak dapat mendeteksi kerusakan spesifik.
                </p>
                <button
                  onClick={resetDiagnosis}
                  className="py-2 px-4 sm:px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Ulangi Diagnosa
                </button>
              </div>
            )}
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={resetDiagnosis}
                className="py-2 px-4 sm:px-6 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Diagnosa Ulang
              </button>
            </div>
          </div>
        )}

        {/* Information Section */}
        <div className="mt-10 bg-white rounded-xl shadow-xl p-4 sm:p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Tentang Sistem Ini</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Metode Forward Chaining + Certainty Factor</h3>
              <p className="text-gray-600">
                Forward Chaining adalah strategi pencarian dalam sistem pakar yang dimulai dari sekumpulan data atau fakta. 
                Sistem akan mencari kesimpulan yang menjadi solusi dari permasalahan yang dihadapi berdasarkan aturan IF-THEN.
                Certainty Factor (CF) menambahkan tingkat kepercayaan terhadap hasil diagnosis.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Akurasi Sistem</h3>
              <p className="text-gray-600">
                Berdasarkan penelitian, sistem ini menghasilkan tingkat akurasi sebesar 100% menggunakan 29 data uji. 
                Sistem ini dapat digunakan untuk mendeteksi kerusakan jaringan internet di Layanan Internet Diskominfotik Sumatera Barat.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;