import { db } from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getProdutos = (_, res) => {
  const q = "SELECT * FROM produtos";

  db.query(q, (err, data) => {
    if (err) return res.json(err);

    return res.status(200).json(data);
  });
};

export const addProdutos = (req, res) => {
  const q = 
  "INSERT INTO produtos(`nome`, `quantidade`, `categoria`, `preco`, `status`) VALUES(?)";

  const values = [
    req.body.nome,
    req.body.quantidade,
    req.body.categoria,
    req.body.preco,
    req.body.status,
  ];

  db.query(q, [values], (err) => {
    if (err) return res.json(err);

    return res.status(200).json("Produto cadastrado com sucesso.");
  });
};

export const updateProdutos = (req, res) => {
  const q = 
    "UPDATE produtos SET `nome` = ?, `quantidade` = ?, `categoria` = ?, `preco` = ?, `status` = ? WHERE `id` = ?";

  const values = [
    req.body.nome,
    req.body.quantidade,
    req.body.categoria,
    req.body.preco,
    req.body.status,
  ];

  db.query(q, [...values, req.params.id], (err) => {
    if (err) {
      console.error("Erro ao atualizar o produto:", err);
      return res.status(500).json(err);  // Envia erro ao cliente e para o log
    }

    return res.status(200).json("Produto atualizado com sucesso.");
  });
};

export const deleteProdutos = (req, res) => {
  // Primeiro, obtenha o nome do produto para registrar no log de exclusões
  const getProdutoQuery = "SELECT nome FROM produtos WHERE id = ?";

  db.query(getProdutoQuery, [req.params.id], (err, result) => {
    if (err) {
      console.error("Erro ao buscar produto:", err);
      return res.status(500).json("Erro ao buscar produto.");
    }

    // Verifica se o produto existe
    if (result.length === 0) {
      return res.status(404).json("Produto não encontrado.");
    }

    const nomeProduto = result[0].nome;

    // Exclui o produto da tabela de produtos
    const deleteProdutoQuery = "DELETE FROM produtos WHERE id = ?";

    db.query(deleteProdutoQuery, [req.params.id], (err) => {
      if (err) {
        console.error("Erro ao deletar produto:", err);
        return res.status(500).json("Erro ao deletar produto.");
      }

      // Insere o log de exclusão na tabela 'exclusoes'
      const insertLogQuery = "INSERT INTO exclusoes (produto_id, nome_produto) VALUES (?, ?)";
      db.query(insertLogQuery, [req.params.id, nomeProduto], (err) => {
        if (err) {
          console.error("Erro ao registrar log de exclusão:", err);
          return res.status(500).json("Erro ao registrar log de exclusão.");
        }

        // Confirma a exclusão e o registro no log
        return res.status(200).json("Produto deletado com sucesso e registrado no log.");
      });
    });
  });
};

// Função para obter a contagem de produtos disponíveis e indisponíveis
export const getContagemProdutos = (req, res) => {
  const qDisponiveis = "SELECT COUNT(*) AS total FROM produtos WHERE status = 'disponível'";
  const qIndisponiveis = "SELECT COUNT(*) AS total FROM produtos WHERE status = 'indisponível'";

  db.query(qDisponiveis, (err, dadosDisponiveis) => {
    if (err) return res.json(err);

    db.query(qIndisponiveis, (err, dadosIndisponiveis) => {
      if (err) return res.json(err);

      const resposta = {
        disponiveis: dadosDisponiveis[0].total,
        indisponiveis: dadosIndisponiveis[0].total,
      };
      return res.status(200).json(resposta);
    });
  });
};

export const getExclusoes = (_, res) => {
  const q = "SELECT * FROM exclusoes";

  db.query(q, (err, data) => {
    if (err) return res.json(err);

    return res.status(200).json(data);
  });
};

export const register = (req, res) => {
  const { usuario, email, senha, role } = req.body;

  // Valida os campos obrigatórios
  if (!usuario || !email || !senha) {
    return res.status(400).json({ error: "Todos os campos (usuario, email, senha) são obrigatórios." });
  }

  // Verifica se o e-mail já está cadastrado
  const qEmail = "SELECT * FROM usuarios WHERE email = ?";
  db.query(qEmail, [email], (err, data) => {
    if (err) {
      console.error("Erro ao consultar o banco:", err);
      return res.status(500).json({ error: "Erro ao consultar o banco de dados." });
    }
    if (data.length > 0) {
      return res.status(409).json({ error: "E-mail já cadastrado!" });
    }

    // Verifica se o nome de usuário já está em uso
    const qUsuario = "SELECT * FROM usuarios WHERE usuario = ?";
    db.query(qUsuario, [usuario], (err, data) => {
      if (err) {
        console.error("Erro ao consultar o banco:", err);
        return res.status(500).json({ error: "Erro ao consultar o banco de dados." });
      }
      if (data.length > 0) {
        return res.status(409).json({ error: "Nome de usuário já está em uso!" });
      }

      // Hash da senha
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(senha, salt);

      // Insere o novo usuário no banco
      const insertQuery = "INSERT INTO usuarios (usuario, email, senha, role) VALUES (?, ?, ?, ?)";
      db.query(insertQuery, [usuario, email, hash, role || "user"], (err) => {
        if (err) {
          console.error("Erro ao inserir no banco:", err);
          return res.status(500).json({ error: "Erro ao registrar o usuário." });
        }
        return res.status(201).json({ message: "Usuário registrado com sucesso!" });
      });
    });
  });
};

// Login de Usuário
export const login = (req, res) => {
  const { email, senha } = req.body;

  // Busca o usuário no banco
  const q = "SELECT * FROM usuarios WHERE email = ?";
  db.query(q, [email], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("Usuário não encontrado!");

    // Verifica a senha
    const user = data[0];
    const isPasswordValid = bcrypt.compareSync(senha, user.senha);
    if (!isPasswordValid) return res.status(401).json("Credenciais inválidas!");

    // Gera o token JWT
    const token = jwt.sign({ id: user.id }, "secreto", { expiresIn: "1h" });

    // Retorna o token, o usuário e a role
    return res.status(200).json({
      token,
      role: user.role,  // Incluindo o campo role
      user: { 
        id: user.id, 
        usuario: user.usuario, 
        email: user.email 
      }
    });
  });
};

export const getSomaPrecosDisponiveis = (req, res) => {
  // SQL modificado para multiplicar quantidade pelo preço de cada produto
  const q = `
    SELECT SUM(quantidade * preco) AS totalPrecos
    FROM produtos
    WHERE status = 'disponível'
  `;

  db.query(q, (err, dados) => {
    if (err) return res.json(err);

    const resposta = {
      totalPrecos: dados[0].totalPrecos || 0, // Caso não haja produtos disponíveis, retorna 0
    };

    return res.status(200).json(resposta);
  });
};


export const getSomaQuantidadesDisponiveis = (req, res) => {
  // SQL para somar a quantidade de todos os produtos disponíveis
  const q = `
    SELECT SUM(quantidade) AS totalQuantidades
    FROM produtos
    WHERE status = 'disponível'
  `;

  db.query(q, (err, dados) => {
    if (err) return res.json(err);

    const resposta = {
      totalQuantidades: dados[0].totalQuantidades || 0, // Caso não haja produtos disponíveis, retorna 0
    };

    return res.status(200).json(resposta);
  });
};




