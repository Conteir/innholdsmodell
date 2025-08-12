import { useState, useEffect } from "react"
import axios from "axios"
import ContentTypeTable from "./components/ContentTypeTable"
import AddContentTypeForm from "./components/AddContentTypeForm"
import AttributeOverview from "./components/AttributeOverview"

function App() {
  const [contentTypes, setContentTypes] = useState([])
  const [attributes, setAttributes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    console.log("Starter henting av data...")
    // Hent attributter
    axios
      .get("http://localhost:3000/api/attributes")
      .then((res) => {
        console.log("Hentet attributter:", res.data)
        setAttributes(res.data)
      })
      .catch((err) => console.error("Feil ved henting av attributter:", err))

    // Hent innholdstyper
    axios
      .get("http://localhost:3000/api/content-types")
      .then((res) => {
        console.log("Hentet innholdstyper:", res.data)
        setContentTypes(res.data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Feil ved henting av innholdstyper:", err)
        setLoading(false)
      })
  }, [])

  const handleAddContentType = (newType) => {
    axios
      .post("http://localhost:3000/api/content-types", newType)
      .then((res) => setContentTypes([...contentTypes, res.data]))
      .catch((err) => console.error("Feil ved lagring av innholdstype:", err))
  }

  const enrichedContentTypes = contentTypes.map((type) => {
    const coreAttributes = attributes.filter((attr) => attr.Kjerneattributt)
    const specificAttributes = type.specificAttributes
      .map((attrName) =>
        attributes.find(
          (attr) => attr["Feltnavn (redaktørverktøy)"] === attrName
        )
      )
      .filter(Boolean)
    return {
      ...type,
      attributes: [...coreAttributes, ...specificAttributes],
    }
  })

  return (
    <div className="container">
      <h1 className="title">Innholdsmodell Forvaltning</h1>
      {loading ? (
        <p className="loading-message">Laster data...</p>
      ) : (
        <>
          <ContentTypeTable contentTypes={enrichedContentTypes} />
          <AddContentTypeForm onAdd={handleAddContentType} />
          <AttributeOverview
            contentTypes={enrichedContentTypes}
            attributes={attributes}
          />
        </>
      )}
    </div>
  )
}

export default App
