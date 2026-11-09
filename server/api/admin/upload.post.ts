import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { randomUUID } from 'crypto'
import { getAuthenticatedUser } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  // Garante que apenas usuários autenticados possam enviar arquivos
  getAuthenticatedUser(event)

  const form = await readMultipartFormData(event)
  if (!form || form.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Nenhum arquivo enviado.',
    })
  }

  const fileItem = form.find((item) => item.name === 'file' || item.filename)
  if (!fileItem || !fileItem.data || !fileItem.filename) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Arquivo de imagem inválido.',
    })
  }

  // Validação básica de extensão/tipo
  const originalName = fileItem.filename
  const ext = (originalName.split('.').pop() || 'jpg').toLowerCase()
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg']
  
  if (!allowedExtensions.includes(ext)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Formato não suportado. Envie arquivos JPG, PNG, WEBP, GIF ou SVG.',
    })
  }

  // Gera nome único seguro
  const filename = `${randomUUID()}.${ext}`
  const uploadDir = join(process.cwd(), 'public', 'uploads')

  // Cria pasta public/uploads caso não exista
  await mkdir(uploadDir, { recursive: true })

  // Salva no disco
  const filePath = join(uploadDir, filename)
  await writeFile(filePath, fileItem.data)

  const publicUrl = `/uploads/${filename}`

  return {
    url: publicUrl,
    filename,
    originalName,
    size: fileItem.data.length,
  }
})

