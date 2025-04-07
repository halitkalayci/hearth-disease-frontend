"use client";

import { useState } from "react";

// Form tipleri
interface FormData {
  Age: number;
  Sex: number;
  ChestPainType: number;
  RestingBP: number;
  Cholesterol: number;
  FastingBS: number;
  RestingECG: number;
  MaxHR: number;
  ExerciseAngina: number;
  Oldpeak: number;
  ST_Slope: number;
}

export default function Home() {
  // Form verisi ve sonuç için state
  const [formData, setFormData] = useState<FormData>({
    Age: 50,
    Sex: 0,
    ChestPainType: 0,
    RestingBP: 120,
    Cholesterol: 200,
    FastingBS: 0,
    RestingECG: 0,
    MaxHR: 150,
    ExerciseAngina: 0,
    Oldpeak: 0,
    ST_Slope: 0,
  });
  
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Girdi değişikliklerini işleme
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "Oldpeak" ? parseFloat(value) : parseInt(value, 10),
    });
  };

  // Formu gönderme
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Python API endpoint'ine istek at
      const response = await fetch("http://localhost:8000/predict", { // API URL'nizi güncelleyin
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error(`API hatası: ${response.status}`);
      }
      
      const data = await response.json();
      setResult(data.prediction);
    } catch (err) {
      setError(`Hata oluştu: ${err instanceof Error ? err.message : "Bilinmeyen hata"}`);
    } finally {
      setLoading(false);
    }
  };

  // Seçenekler için etiket ve değer çiftleri
  const sexOptions = [
    { value: 0, label: "Kadın" },
    { value: 1, label: "Erkek" },
  ];
  
  const chestPainOptions = [
    { value: 0, label: "Tipik Anjina" },
    { value: 1, label: "Atipik Anjina" },
    { value: 2, label: "Anjinal Olmayan Ağrı" },
    { value: 3, label: "Asemptomatik" },
  ];
  
  const restingECGOptions = [
    { value: 0, label: "Normal" },
    { value: 1, label: "ST-T Dalga Anormalliği" },
    { value: 2, label: "Sol Ventrikül Hipertrofisi" },
  ];
  
  const binaryOptions = [
    { value: 0, label: "Hayır" },
    { value: 1, label: "Evet" },
  ];
  
  const stSlopeOptions = [
    { value: 0, label: "Yukarı" },
    { value: 1, label: "Düz" },
    { value: 2, label: "Aşağı" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Kalp Hastalığı Tahmini
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Sağlık verilerinizi girin ve AI modelimizin tahminini görün
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden">
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Yaş */}
                <div>
                  <label htmlFor="Age" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Yaş
                  </label>
                  <input
                    type="number"
                    id="Age"
                    name="Age"
                    value={formData.Age}
                    onChange={handleChange}
                    min="1"
                    max="120"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                {/* Cinsiyet */}
                <div>
                  <label htmlFor="Sex" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Cinsiyet
                  </label>
                  <select
                    id="Sex"
                    name="Sex"
                    value={formData.Sex}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  >
                    {sexOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Göğüs Ağrısı Tipi */}
                <div>
                  <label htmlFor="ChestPainType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Göğüs Ağrısı Tipi
                  </label>
                  <select
                    id="ChestPainType"
                    name="ChestPainType"
                    value={formData.ChestPainType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  >
                    {chestPainOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dinlenme Tansiyonu */}
                <div>
                  <label htmlFor="RestingBP" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Dinlenme Kan Basıncı (mmHg)
                  </label>
                  <input
                    type="number"
                    id="RestingBP"
                    name="RestingBP"
                    value={formData.RestingBP}
                    onChange={handleChange}
                    min="80"
                    max="200"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                {/* Kolesterol */}
                <div>
                  <label htmlFor="Cholesterol" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Kolesterol (mg/dl)
                  </label>
                  <input
                    type="number"
                    id="Cholesterol"
                    name="Cholesterol"
                    value={formData.Cholesterol}
                    onChange={handleChange}
                    min="100"
                    max="600"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                {/* Açlık Kan Şekeri */}
                <div>
                  <label htmlFor="FastingBS" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Açlık Kan Şekeri {'>'} 120 mg/dl
                  </label>
                  <select
                    id="FastingBS"
                    name="FastingBS"
                    value={formData.FastingBS}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  >
                    {binaryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dinlenme EKG Sonucu */}
                <div>
                  <label htmlFor="RestingECG" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Dinlenme EKG Sonucu
                  </label>
                  <select
                    id="RestingECG"
                    name="RestingECG"
                    value={formData.RestingECG}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  >
                    {restingECGOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Maksimum Kalp Hızı */}
                <div>
                  <label htmlFor="MaxHR" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Maksimum Kalp Hızı
                  </label>
                  <input
                    type="number"
                    id="MaxHR"
                    name="MaxHR"
                    value={formData.MaxHR}
                    onChange={handleChange}
                    min="60"
                    max="220"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                {/* Egzersiz Anjini */}
                <div>
                  <label htmlFor="ExerciseAngina" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Egzersizde Angina
                  </label>
                  <select
                    id="ExerciseAngina"
                    name="ExerciseAngina"
                    value={formData.ExerciseAngina}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  >
                    {binaryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Oldpeak */}
                <div>
                  <label htmlFor="Oldpeak" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Oldpeak (ST Çökmesi)
                  </label>
                  <input
                    type="number"
                    id="Oldpeak"
                    name="Oldpeak"
                    value={formData.Oldpeak}
                    onChange={handleChange}
                    min="0"
                    max="10"
                    step="0.1"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                {/* ST_Slope */}
                <div>
                  <label htmlFor="ST_Slope" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    ST Eğimi
                  </label>
                  <select
                    id="ST_Slope"
                    name="ST_Slope"
                    value={formData.ST_Slope}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  >
                    {stSlopeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-center mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 text-white font-medium rounded-lg text-base transition duration-150 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? "Tahmin ediliyor..." : "Tahmin Et"}
                </button>
              </div>
            </form>
          </div>

          {/* Sonuç Bölümü */}
          {(result || error || true) && (
            <div className={`p-6 border-t ${error ? "bg-red-50 dark:bg-red-900/20" : result == "1" ? "bg-red-50 dark:bg-red-900/20" : "bg-green-50 dark:bg-green-900/20"}`}>
              {error ? (
                <div className="text-red-600 dark:text-red-400 text-center">
                  <p className="font-semibold">{error}</p>
                </div>
              ) : (
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Tahmin Sonucu</h3>
                  <div className={`p-4 ${result == "1" ? "bg-red-100 dark:bg-red-900/40" : "bg-green-100 dark:bg-green-900/40"} rounded-lg inline-block shadow-sm`}>
                    <p className={`text-2xl font-bold ${result == "1" ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}>
                      {result == "1" ? "Hastalık Riski Var" : "Hastalık Riski Yok"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Bu uygulama, sağlık verilerinizi kullanarak tahmin yapar. Lütfen tanı için her zaman bir sağlık uzmanına danışın.</p>
        </div>
      </div>
    </div>
  );
}
