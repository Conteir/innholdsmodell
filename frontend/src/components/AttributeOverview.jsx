import { useState, useEffect } from "react"

function AttributeOverview({ contentTypes, attributes }) {
  const [allAttributes, setAllAttributes] = useState([]) // Gjeninnfør som state
  const [filter, setFilter] = useState("all")
  const [columns, setColumns] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    console.log("useEffect kjører med contentTypes:", contentTypes)
    console.log("Nåværende attributes-prop:", attributes)
    console.log(
      "Betingelsessjekk - contentTypes.length:",
      contentTypes.length,
      "attributes.length:",
      attributes.length
    )

    const tempAttributes = []
    const allAttributeFields = new Set()

    if (contentTypes.length > 0 && attributes.length > 0) {
      console.log("Betingelse oppfylt, prosesserer data...")
      contentTypes.forEach((type) => {
        console.log("Prosesserer innholdstype:", type)
        const coreAttributes = attributes.filter((attr) => attr.Kjerneattributt)
        const specificAttributes = type.specificAttributes
          .map((attrName) =>
            attributes.find(
              (attr) => attr["Feltnavn (redaktørverktøy)"] === attrName
            )
          )
          .filter(Boolean)
        const allTypeAttributes = [...coreAttributes, ...specificAttributes]

        allTypeAttributes.forEach((attr) => {
          console.log("Sjekker attributt:", attr)
          if (
            attr &&
            attr["Feltnavn (redaktørverktøy)"] &&
            !tempAttributes.some(
              (a) =>
                a["Feltnavn (redaktørverktøy)"] ===
                attr["Feltnavn (redaktørverktøy)"]
            )
          ) {
            tempAttributes.push({ ...attr, source: type.name })
            Object.keys(attr).forEach((key) => allAttributeFields.add(key))
          }
        })
      })

      console.log("Alle attributter:", tempAttributes)
      setAllAttributes(tempAttributes) // Oppdater state
      setColumns(Array.from(allAttributeFields))
      setLoading(false)
    } else {
      console.log(
        "Betingelse ikke oppfylt, contentTypes eller attributes er tom."
      )
      setLoading(false)
    }
  }, [contentTypes, attributes])

  const filteredAttributes = allAttributes.filter((attr) => {
    if (filter === "core") return attr.Kjerneattributt
    if (filter === "specific") return !attr.Kjerneattributt
    return true // 'all'
  })

  console.log("Filtrerte attributter:", filteredAttributes)

  return (
    <div className="mt-8 p-4 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Attributtoversikt</h2>
      <div className="mb-4">
        <label className="mr-4">
          <input
            type="radio"
            value="all"
            checked={filter === "all"}
            onChange={(e) => setFilter(e.target.value)}
            className="mr-1"
          />
          Alle
        </label>
        <label className="mr-4">
          <input
            type="radio"
            value="core"
            checked={filter === "core"}
            onChange={(e) => setFilter(e.target.value)}
            className="mr-1"
          />
          Kjerneattributter
        </label>
        <label>
          <input
            type="radio"
            value="specific"
            checked={filter === "specific"}
            onChange={(e) => setFilter(e.target.value)}
            className="mr-1"
          />
          Spesifikke attributter
        </label>
      </div>
      {loading ? (
        <p className="loading-message">Laster attributter...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="attribute-table">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredAttributes.map((attr) => (
                <tr key={attr["Feltnavn (redaktørverktøy)"]}>
                  {columns.map((column) => (
                    <td key={`${attr["Feltnavn (redaktørverktøy)"]}-${column}`}>
                      {typeof attr[column] === "boolean"
                        ? attr[column]
                          ? "Ja"
                          : "Nei"
                        : attr[column] || "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AttributeOverview
