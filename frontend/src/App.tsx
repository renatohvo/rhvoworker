import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { format } from 'date-fns';
import { BASE_URL } from './util/request';
import './App.css'

interface Worker {
  id: number;
  name: string;
  cpf: string;
  income: number;
  birthDate: string;
  children: number;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate() + 1}`.slice(-2);

  return `${year}-${month}-${day}`;
};


function App() {
  const [data, setData] = useState<Worker[]>([]);
  const [newItem, setNewItem] = useState<Worker>({
    id: 0,
    name: '',
    cpf: '',
    income: 0,
    birthDate: '',
    children: 0
  });
  const [editItem, setEditItem] = useState<Worker | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await fetch(`${BASE_URL}/workers?sort=id,desc`);
    const jsonData = await response.json();
    setData(jsonData.content);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const addWorker = async (e: FormEvent) => {
    e.preventDefault();

    const { birthDate, ...rest } = newItem;
    const formattedBirthDate = format(
      new Date(birthDate),
      "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
    );

    await fetch(`${BASE_URL}/workers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...rest, birthDate: formattedBirthDate })
    });

    fetchData();
    setNewItem({
      id: 0,
      name: '',
      cpf: '',
      income: 0,
      birthDate: '',
      children: 0
    });
  };

  const editWorker = (worker: Worker) => {
    const formattedBirthDate = formatDate(worker.birthDate); // Função auxiliar para formatar a data
    setEditItem({ ...worker, birthDate: formattedBirthDate });
  };

  const deleteWorker = async (workerId: number) => {
    await fetch(`${BASE_URL}/workers/${workerId}`, {
      method: 'DELETE'
    });

    fetchData();
  };

  const cancelEdit = () => {
    setEditItem(null);
  };

  const updateWorker = async () => {
    if (editItem) {
      const formattedBirthDate = format(
        new Date(editItem.birthDate),
        "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
      );

      await fetch(`${BASE_URL}/workers/${editItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...editItem, birthDate: formattedBirthDate }),
      });

      fetchData();
      setEditItem(null);
    }
  };

  return (
    <div className="container">
      <h1>Lista de Trabalhadores</h1>
      <div className="edit-form">
        <h3>Adicionar Trabalhador</h3>
        <form onSubmit={addWorker}>
          <input
            type="text"
            name="name"
            placeholder="Nome"
            value={newItem.name}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="cpf"
            placeholder="CPF"
            value={newItem.cpf}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="income"
            placeholder="Renda"
            value={newItem.income}
            onChange={handleInputChange}
          />
          <input
            type="date"
            name="birthDate"
            placeholder="Data de Nascimento"
            value={newItem.birthDate}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="children"
            placeholder="Número de Filhos"
            value={newItem.children}
            onChange={handleInputChange}
          />
          <button type="submit">Adicionar</button>
        </form>
      </div>
      <ul>
        {data.map((worker) => (
          <li key={worker.id} className="edit-item">
            <div>Nome: {worker.name}</div>
            <div>CPF: {worker.cpf}</div>
            <div>Renda: R$ {worker.income}</div>
            <div>Data de Nascimento: {formatDate(worker.birthDate)}</div>
            <div>Número de Filhos: {worker.children}</div>
            {editItem && editItem.id === worker.id ? (
              <div>
                <input
                  type="text"
                  className="edit-input"
                  value={editItem.name}
                  onChange={(e) =>
                    setEditItem({ ...editItem, name: e.target.value })
                  }
                />
                <input
                  type="text"
                  className="edit-input"
                  value={editItem.cpf}
                  onChange={(e) =>
                    setEditItem({ ...editItem, cpf: e.target.value })
                  }
                />
                <input
                  type="number"
                  className="edit-input"
                  value={editItem.income}
                  onChange={(e) =>
                    setEditItem({ ...editItem, income: Number(e.target.value) })
                  }
                />
                <input
                  type="date"
                  className="edit-input"
                  value={editItem.birthDate}
                  onChange={(e) =>
                    setEditItem({ ...editItem, birthDate: e.target.value })
                  }
                />
                <input
                  type="number"
                  className="edit-input"
                  value={editItem.children}
                  onChange={(e) =>
                    setEditItem({ ...editItem, children: Number(e.target.value) })
                  }
                />
                <div >
                  <button onClick={updateWorker}>Salvar</button>
                  <button onClick={cancelEdit} className="cancel-button">Cancelar</button>
                </div>
              </div>
            ) : (
              <div >
                <button onClick={() => deleteWorker(worker.id)} className="cancel-button">Deletar</button>
                <button onClick={() => editWorker(worker)}>Editar</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
