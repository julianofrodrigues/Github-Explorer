import React, { useState, useEffect, FormEvent } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import logoImg from '../../assets/logo.svg';
import { Title, Form, Repositories, Error } from './styles';

interface Repository {
    full_name: string;
    description: string;
    owner: {
        login: string;
        avatar_url: string;
    }
};

const Dashboard: React.FC = () => {
    const [newRepo, setNewRepo] = useState('');
    const  [inputError, setInputError] = useState('');
    const [repositories, setRepositories] = useState<Repository[]>(() => {
        const storagedRepositories = localStorage.getItem(
            '@GithubExplorer:repositories',
        );

        if (storagedRepositories){
            return JSON.parse(storagedRepositories);
        }
        return [];
    });

    //Outra forma de se fazer
    //const [repositories, setRepositories] = useState<Repository[]>([]);
    //  useEffect(() => {
    //      const repositorios = localStorage.getItem('@GithubExplorer:repositories');
    //      if(repositorios){
    //          setRepositories(JSON.parse(repositorios));
    //      }
    //  }, []);

    useEffect(() => {
        localStorage.setItem('@GithubExplorer:repositories', JSON.stringify(repositories));
    }, [repositories]);

    //Adiciona um novo repositorio,consome api do git, salva novo repositorio no estado
    async function handleAddRepository(e: FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();

        if(!newRepo){
            setInputError('Digite o usuário/nome do repositório');
            return;
        }

        try {
            const response = await api.get<Repository>(`repos/${newRepo}`);
            const repository = response.data;
            setRepositories([...repositories, repository]);
            setNewRepo('');
            setInputError('');
        } catch(err){
            setInputError('Erro na busca por esse repositório.');
        }
    }

    return(
        <>
            <img src={logoImg} alt='Github logo' />
            <Title>Explorer Repositórios no Github</Title>
            <Form hasError={!!inputError} onSubmit={handleAddRepository}>
                <input
                value={newRepo}
                onChange={e => setNewRepo(e.target.value)}
                placeholder="Digite o nome do Repositório" />
                <button>Pesquisar</button>
            </Form>

            {inputError && <Error>{inputError}</Error>}

            <Repositories>
               {repositories.map(repository => (
                <Link key={repository.full_name} to={`/repository/${repository.full_name}`}>
                   <img src={repository.owner.avatar_url} alt={repository.owner.login}/>
                   <div>
                    <strong>{repository.full_name}</strong>
                    <p>{repository.description}</p>
                   </div>
                   <FiChevronRight size={20} />
               </Link>
               ))}
            </Repositories>
        </>
    )
};

export default Dashboard;
