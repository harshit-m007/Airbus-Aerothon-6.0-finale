import React, { useState } from "react"
import axios from "axios"

function DamageDetection() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [damageResult, setDamageResult] = useState(null)
  const [error, setError] = useState(null)

  const handleImageChange = event => {
    setSelectedImage(event.target.files[0])
  }

  const handleImageUpload = async () => {
    const formData = new FormData()
    formData.append("image", selectedImage)

    try {
      const response = await axios.post("http://localhost:5000/detect_and_recommend", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      setDamageResult(response.data)
    } catch (error) {
      console.error("Error detecting damage:", error)
      setError("An error occurred while processing the image.")
    }
  }

  return (
    <div>
      <h2 className="analysis-heading">Damage Detection</h2>
      <p>
        <strong>Choose an image</strong>
      </p>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button className="button" onClick={handleImageUpload}>
        Detect Damage
      </button>
      {error && <p>Error: {error}</p>}
      {damageResult && (
        <div>
          <h3>Cracks and Dents Detection and Repair Recommendations</h3>
          {damageResult.detections && damageResult.detections.length > 0 && (
            <div>
              <h3>Detections</h3>
              <p>Detections:</p>
              <ul>
                {damageResult.detections.map((damage, index) => (
                  <li key={index}>
                    Damage {index + 1}: Location = ({damage.location.join(", ")}), Severity = {damage.severity.toFixed(2)}, Type = {damage.type}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {damageResult.repair_recommendations && damageResult.repair_recommendations.length > 0 && (
            <>
              <p>
                <strong>Repair Recommendations:</strong>
              </p>
              <ul>
                {damageResult.repair_recommendations.map((recommendation, index) => (
                  <li key={index}>
                    Damage {index + 1}: {recommendation.action} - {recommendation.details}
                  </li>
                ))}
              </ul>
            </>
          )}
          {damageResult.result_image && (
            <div>
              <h3>Result Image</h3>
              <img src={`data:image/jpeg;base64,${damageResult.result_image}`} alt="Result" />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default DamageDetection
