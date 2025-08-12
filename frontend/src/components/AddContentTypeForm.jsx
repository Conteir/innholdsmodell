import { useState } from "react"

function AddContentTypeForm({ onAdd }) {
  const [name, setName] = useState("")
  const [technicalName, setTechnicalName] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    onAdd({ name, technicalName, attributes: [] })
    setName("")
    setTechnicalName("")
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Legg til ny innholdstype</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block">Navn</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block">Teknisk Navn</label>
          <input
            type="text"
            value={technicalName}
            onChange={(e) => setTechnicalName(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Legg til
        </button>
      </form>
    </div>
  )
}

export default AddContentTypeForm
