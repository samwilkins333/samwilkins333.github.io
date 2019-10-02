import React from 'react';
import "./Repositories.css";
import { observable, runInAction } from 'mobx';
import { observer } from 'mobx-react';
import Repository from './Repository';
import { BatchedArray, TimeUnit } from "array-batcher";
import { ColorScheme } from '../ColorScheme';

const username = "samwilkins333";
const apiEndpoint = "https://api.github.com/user/repos";

export interface RepositoriesProps {
    onLoad: () => void;
    setSelected: (repository: Repository | undefined) => void;
    currentPage: number;
}

@observer
export default class Repositories extends React.Component<RepositoriesProps> {
    @observable private repositories: any[] = [];
    @observable private background = ColorScheme.primary;
    @observable private marginTop = 0;

    populate = () => {
        const headers = { Authorization: `token ${process.env.REACT_APP_GITHUB_KEY}` };
        fetch(apiEndpoint, { headers }).then(async response => {
            const repositories = await response.json() as any[];
            const mine = repositories.filter(repo => repo.full_name.startsWith(username));
            await BatchedArray.from(mine, { batchSize: 1 }).batchedForEachNaiveInterval(
                { magnitude: 100, unit: TimeUnit.Milliseconds },
                batch => {
                    runInAction(() => this.repositories.push(...batch))
                }
            );
            this.props.onLoad();
            this.marginTop = 3;
        });
    }

    private displayRepositories = () => {
        return this.repositories.map(repo =>
            <Repository
                key={repo.id}
                model={repo}
                marginTop={this.marginTop}
                setSelected={this.props.setSelected}
            />
        );
    }

    render() {
        return (
            <div
                className={'repositories-container'}
                onClick={() => this.props.setSelected(undefined)}
                style={{
                    background: this.background,
                }}
            >
                {this.displayRepositories()}
            </div>
        )
    }

}