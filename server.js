import express from 'express'
import mysql from 'mysql2/promise'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

const pool = mysql.createPool({
    host: 'benserverplex.ddns.net',
    user: 'alunos',
    password: 'senhaAlunos',
    database: 'web_03mc', // Adicionei um banco de dados opcional, mas você pode ajustar
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

app.get('/', (req, res) => {
  res.json({
    message: "Olá, mundo. O servidor está funcionando normalmente!"
  })
})

app.post('/produtos', async (req, res) => {
    const { nome, preco, categoria, descricao } = req.body

    const query = 'INSERT INTO produtos_victor (nome, preco, categoria, descricao) VALUES (?, ?, ?, ?)'
    const result = await pool.query(query, [nome, preco, categoria, descricao]).catch(error => {
        console.error(error)
    })

    if (!result) {
        return res.status(500).json({ mensagem: 'Erro ao cadastrar o produto' })
    }

    res.status(201).json({ mensagem: 'Produto cadastrado com sucesso' })
})

app.get('/produtos', async (req, res) => {
    const query = 'SELECT id, nome, preco, categoria, descricao FROM produtos_victor'
    const result = await pool.query(query).catch(error => {
        console.error(error)
    })

    if (!result) {
        return res.status(500).json({ mensagem: 'Erro ao exibir os produtos' })
    }

    const [rows] = result
    res.status(200).json(rows)
})

app.delete('/produtos/:id', async (req, res) => {
    const { id } = req.params

    const query = 'DELETE FROM produtos_victor WHERE id = ?'
    const result = await pool.query(query, [id]).catch(error => {
        console.error(error)
    })

    if (!result) {
        return res.status(500).json({ mensagem: 'Erro ao excluir o produto' })
    }

    res.status(200).json({ mensagem: 'Produto excluído com sucesso' })
})

app.listen(3333, () => {
    console.log('Server running on port http://localhost:3333')
})