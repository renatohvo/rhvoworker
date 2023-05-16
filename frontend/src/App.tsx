import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { format } from 'date-fns';
import { BASE_URL } from './util/request';
import CurrencyInputField from 'react-currency-input-field';
import InputMask from 'react-input-mask';
import './App.css'

interface Worker {
  id: number;
  name: string;
  cpf: string;
  income: number;
  birthDate: string;
  children: string;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate() + 1}`.slice(-2);

  return `${year}-${month}-${day}`;
};


function App() {
  const [isFormValid, setIsFormValid] = useState(true);
  const [data, setData] = useState<Worker[]>([]);
  const [newItem, setNewItem] = useState<Worker>({
    id: 0,
    name: '',
    cpf: '',
    income: 1,
    birthDate: '',
    children: ''
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

    if (!newItem.name || !newItem.cpf || !newItem.income || !newItem.birthDate || !newItem.children) {
      setIsFormValid(false);
      return;
    }
    setIsFormValid(true);

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
      income: 1,
      birthDate: '',
      children: ''
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

      if (!editItem.name || !editItem.cpf || !editItem.income || !editItem.birthDate || !editItem.children) {
        setIsFormValid(false);
        return;
      }
      setIsFormValid(true);  

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
          <InputMask
            mask="999.999.999-99" // Máscara para CPF
            type="text"
            name="cpf"
            placeholder="CPF"
            value={newItem.cpf}
            onChange={handleInputChange}
          />
          <CurrencyInputField
            name="income"
            placeholder="Renda"
            value={newItem.income}
            decimalsLimit={2}
            prefix="R$"
            onValueChange={(e:any) => {
              setNewItem({ ...newItem, income: e });
            }}
          />
          <input
            type="date"
            name="birthDate"
            placeholder="Data de Nascimento"
            value={newItem.birthDate}
            onChange={handleInputChange}
          />
          <InputMask
            mask="9" // Máscara para Número de Filhos
            type="text"
            name="children"
            placeholder="Número de Filhos"
            value={newItem.children}
            onChange={handleInputChange}
          />
          <button type="submit">Adicionar</button>
          {!isFormValid && <div className="error-message">Por favor, preencha todos os campos.</div>}
        </form>
      </div>
      <ul>
        {data.map((worker) => (
          <li key={worker.id} className="edit-item">
            <div>Nome: {worker.name}</div>
            <div>CPF: {worker.cpf}</div>
            <div>Renda: {worker.income.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
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
                <InputMask
                  mask="999.999.999-99" // Máscara para CPF
                  type="text"
                  className="edit-input"
                  value={editItem.cpf}
                  onChange={(e: any) =>
                    setEditItem({ ...editItem, cpf: e.target.value })
                  }
                />
                <CurrencyInputField
                  className="edit-input"
                  value={editItem.income}
                  decimalsLimit={2}
                  prefix="R$"
                  onValueChange={(e:any) =>
                    setEditItem({ ...editItem, income: e })
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
                <InputMask
                  mask="9" // Máscara para Número de Filhos
                  type="text"
                  className="edit-input"
                  value={editItem.children}
                  onChange={(e: any) =>
                    setEditItem({ ...editItem, children: e.target.value })
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
