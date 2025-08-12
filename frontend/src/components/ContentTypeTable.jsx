import { useState } from "react"

function ContentTypeTable({ contentTypes }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all") // 'all', 'core', 'specific'
  const [expandedStates, setExpandedStates] = useState({})

  // Filtrer innholdstyper basert på søk
  const filteredContentTypes = contentTypes.filter(
    (type) =>
      type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      type.technicalName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Toggle ekspandert status for en spesifikk innholdstype
  const toggleExpand = (technicalName) => {
    setExpandedStates((prev) => ({
      ...prev,
      [technicalName]: !prev[technicalName],
    }))
  }

  return (
    <div className="container">
      <h2 className="title">Innholdstyper</h2>
      <div className="search-container">
        <input
          type="text"
          placeholder="Søk etter innholdstype..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <div className="filter-container">
          <label className="filter-label">
            <input
              type="radio"
              value="all"
              checked={filter === "all"}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-radio"
            />
            Alle
          </label>
          <label className="filter-label">
            <input
              type="radio"
              value="core"
              checked={filter === "core"}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-radio"
            />
            Kun kjerne
          </label>
          <label className="filter-label">
            <input
              type="radio"
              value="specific"
              checked={filter === "specific"}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-radio"
            />
            Kun spesifikke
          </label>
        </div>
      </div>
      <div className="card-grid">
        {filteredContentTypes.map((type) => {
          const isExpanded = expandedStates[type.technicalName] || false
          const visibleAttributes = type.attributes.filter((attr) => {
            if (filter === "core") return attr.isCore
            if (filter === "specific") return !attr.isCore
            return true
          })

          return (
            <div key={type.technicalName} className="content-card">
              <div className="card-header">
                <div>
                  <h3 className="card-title">{type.name}</h3>
                  <p className="card-subtitle">
                    Teknisk navn: {type.technicalName}
                  </p>
                </div>
                <button
                  onClick={() => toggleExpand(type.technicalName)}
                  className="expand-button"
                >
                  {isExpanded ? "Skjul attributter" : "Vis attributter"}{" "}
                  {isExpanded ? "▲" : "▼"}
                </button>
              </div>
              {isExpanded && visibleAttributes.length > 0 && (
                <div className="attribute-section">
                  <h4 className="attribute-title">Attributter:</h4>
                  <ul className="attribute-list">
                    {visibleAttributes.map((attr) => (
                      <li key={attr.technicalName} className="attribute-item">
                        <span
                          className={
                            attr.isCore
                              ? "core-attribute"
                              : "specific-attribute"
                          }
                        >
                          {attr.editorName} ({attr.technicalName})
                        </span>
                        <span className="attribute-type">{attr.type}</span>
                        <p className="attribute-description">
                          {attr.description}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ContentTypeTable
