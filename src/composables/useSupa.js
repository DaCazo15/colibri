import { createClient } from '@supabase/supabase-js'

const API_URL = import.meta.env.VITE_URL
const API_KEY = import.meta.env.VITE_API_KEY
const supabase = createClient(API_URL, API_KEY)

export function useSupabase() {
  const getTable = async (table) => {
    const { data, error } = await supabase.from(table).select('*')
    if (error) {
      console.error(`Error en getTable (${table}):`, error.message)
      return []
    }
    return data
  }
  const getRolByEmail = async (table, correo) => {
    const { data, error } = await supabase
      .from(table) // Nombre de tu tabla
      .select('rol') // Solo traemos la columna que necesitas
      .eq('email', correo) // Filtro: columna 'email' igual al parámetro correo
      .single() // Para obtener un objeto directo en lugar de un array

    if (error) {
      console.error('Error al obtener el rol:', error.message)
      return null
    }

    return data.rol // Retorna directamente el valor (ej. "ADMIN")
  }
  // En useSupa.js
  const getSelectRow = async (table, item, column = 'id') => {
    // Añadimos 'column'
    if (!item) return null

    // Ahora usamos la variable 'column' en lugar de 'email' fijo
    const { data, error } = await supabase.from(table).select('*').eq(column, item)

    if (error) {
      console.error(`Error en getSelectRow (${table}):`, error.message)
      return null
    }

    return data ? data[0] : null // Retornamos el primer objeto directamente
  }

  const getSelectTable = async (table, email) => {
    const { data, error } = await supabase.from(table).select('*').eq('email', email)

    if (error) {
      console.error(`Error en getSelectTable (${table}):`, error.message)
      return []
    }
    return data
  }

  const setItem = async (table, dataValue) => {
    const { data, error } = await supabase.from(table).insert(dataValue).select()
    if (error) {
      console.error(`Error en setItem (${table}):`, error.message)
      return { success: false, error }
    }
    return { success: true, data }
  }

  const setColumnItem = async (table, column, newValue, id) => {
    const { data, error } = await supabase
      .from(table)
      .update({ [column]: newValue }) // Actualiza la columna dinámica
      .eq('id', id) // Usa el ID pasado por parámetro
      .select() // Retorna el registro cambiado

    if (error) {
      console.error(`Error en setColumn (${table} -> ${column}):`, error.message)
      return { success: false, error }
    }

    return { success: true, data: data[0] } // Retornamos el primer objeto del array
  }

  const existeItemEnTabla = async (table, column, value) => {
    const { data, error } = await supabase.from(table).select('*').eq(column, value).single()

    if (error) {
      console.error(`Error en existeItemEnTabla (${table}):`, error.message)
      return false
    }
    return data !== null
  }

  const updateTable = async (table, id, dataValue) => {
    const payload = { ...dataValue }
    delete payload.id
    delete payload.created_at

    const { data, error } = await supabase.from(table).update(payload).eq('id', id).select()

    if (error) {
      console.error(`Error en updateTable (${table}) para ID ${id}:`, error.message)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  }

  const deleteRow = async (table, id) => {
    try {
      const { error } = await supabase.from(table).delete().eq('id', id)

      if (error) throw error
      return true // Éxito
    } catch (err) {
      console.error('Error eliminando registro:', err.message)
      return false // Fallo
    }
  }

  return {
    supabase,
    getTable,
    getRolByEmail,
    getSelectRow,
    getSelectTable,
    setItem,
    setColumnItem,
    existeItemEnTabla,
    updateTable,
    deleteRow,
  }
}
