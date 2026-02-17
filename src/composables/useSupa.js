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

  const setTable = async (table, dataValue) => {
    const { data, error } = await supabase.from(table).insert(dataValue).select()
    if (error) {
      console.error(`Error en setTable (${table}):`, error.message)
      return { success: false, error }
    }
    return { success: true, data }
  }

  const existeItemEnTabla = async (table, column, value) => {
    const { data, error } = await supabase.from(table).select('*').eq(column, value).single()

    if (error) {
      console.error(`Error en existeItemEnTabla (${table}):`, error.message)
      return false
    }
    return data !== null
  }

  const getSelectTable = async (table, item) => {
    if (!item) return null

    const { data, error } = await supabase.from(table).select('*').eq('email', item)

    if (error) {
      console.error(`Error en getSelectTable (${table}):`, error.message)
      return null
    }

    return data
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
    setTable,
    getSelectTable,
    existeItemEnTabla,
    updateTable,
    deleteRow,
  }
}
