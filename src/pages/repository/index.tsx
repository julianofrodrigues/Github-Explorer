import React, { useEffect, useState } from 'react';
import { useRouteMatch, Link } from 'react-router-dom';
import { Header, RepositoryInfo, Issues } from './styles';
import api from '../../services/api';
import logoImg from '../../assets/logo.svg';
import { FiChevronLeft } from 'react-icons/fi';
import { FiChevronRight } from 'react-icons/fi';

interface RepositoryParams {
    repository: string;
}

interface Repository {
    full_name: string;
    description: string;
    stargazers_count: number;
    forks_count: number;
    open_issues_count: number;
    owner: {
        avatar_url: string;
        login: string;
    };
}

interface Issue {
    id: number;
    html_url: string;
    title: string;
    user: {
        login: string;
    };
}

const Repository: React.FC = () => {
    const [repository, setRepository] = useState<Repository | null>(null);
    const [issues, setIssues] = useState<Issue[]>([]);
    const { params } = useRouteMatch<RepositoryParams>();

    //Forma de se utilizar
    // useEffect(() => {
    //     api.get(`repos/${params.repository}`).then(response => {
    //         console.log(response.data);
    //     });
    // }, [params.repository]);

    // useEffect(() => {
    //     api.get(`repos/${params.repository}/issues`).then(response => {
    //         console.log(response.data);
    //     });
    // }, [params.repository]);

    //Outra forma de se utilizar
    // useEffect(() => {
    //     async function loadData(): Promise<void> {
    //         const repositorios = await api.get(`repos/${params.repository}`);
    //         const issues = await api.get(`repos/${params.repository}/issues`);
    //         console.log(repositorios);
    //         console.log(issues);
    //     }
    //     loadData();
    // }, [params.repository]);

    //Forma utilizada
    useEffect(() => {
        async function loadData(): Promise<void> {
            const [repositorios, issue] = await Promise.all([
                await api.get(`repos/${params.repository}`),
                await api.get(`repos/${params.repository}/issues`)
            ])
            setRepository(repositorios.data);
            setIssues(issue.data);
        }
        loadData();
    }, [params.repository]);

    return (
        <>
            <Header>
                <img src={logoImg} alt="Pokemon" />
                <Link to={'/'}>
                    <FiChevronLeft size={16} />
                    Voltar
                </Link>
            </Header>

            {repository && (
                <RepositoryInfo>
                    <header>
                        <img
                            src={repository.owner.avatar_url}
                            alt={repository.owner.login}
                        />
                        <div>
                            <strong>{repository.full_name}</strong>
                            <p>{repository.description}</p>
                        </div>
                    </header>
                    <ul>
                        <li>
                            <strong>{repository.stargazers_count}</strong>
                            <span>Starts</span>
                        </li>
                        <li>
                            <strong>{repository.forks_count}</strong>
                            <span>Forks</span>
                        </li>
                        <li>
                            <strong>{repository.open_issues_count}</strong>
                            <span>Issues Abertas</span>
                        </li>
                    </ul>
                </RepositoryInfo>
            )}

            <Issues>
                {issues.map(issue => (
                    <a key={issue.id} href={issue.html_url}>
                        <div>
                            <strong>{issue.title}</strong>
                            <p>{issue.user.login}</p>
                        </div>
                        <FiChevronRight size={20} />
                    </a>
                ))}
            </Issues>
        </>
    );
};

export default Repository;
