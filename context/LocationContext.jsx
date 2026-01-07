"use client"

import { createContext, useContext, useState, useEffect } from "react"

const LocationContext = createContext()

export const useLocation = () => {
  const context = useContext(LocationContext)
  if (!context) {
    throw new Error("useLocation must be used within LocationProvider")
  }
  return context
}

export const LocationProvider = ({ children }) => {
  const [selectedFakultas, setSelectedFakultas] = useState("")
  const [selectedLokasi, setSelectedLokasi] = useState("")
  const [lokasiData, setLokasiData] = useState(null)

  const setLocation = (fakultas, lokasi, data) => {
    setSelectedFakultas(fakultas)
    setSelectedLokasi(lokasi)
    setLokasiData(data)
  }

  const clearLocation = () => {
    setSelectedFakultas("")
    setSelectedLokasi("")
    setLokasiData(null)
  }

  const isLocationSet = () => {
    return selectedFakultas !== "" && selectedLokasi !== ""
  }

  return (
    <LocationContext.Provider
      value={{
        selectedFakultas,
        selectedLokasi,
        lokasiData,
        setLocation,
        clearLocation,
        isLocationSet,
      }}
    >
      {children}
    </LocationContext.Provider>
  )
}
