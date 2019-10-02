import React from 'react';
import "./Repository.css";
import { observer } from 'mobx-react';
import privateIcon from '../private.png';
import { action, observable, runInAction } from 'mobx';

export interface RepositoryProps {
    model: any;
    marginTop: number;
    setSelected: (repository: Repository) => void;
}

@observer
export default class Repository extends React.Component<RepositoryProps> {
    @observable private color: string = "#000000";
    @observable private selected = false;

    open = () => {
        !this.props.model.private && window.open(`https://github.com/samwilkins333/${this.props.model.name}`);
    }

    private select = (e: React.PointerEvent<HTMLDivElement>) => {
        e.stopPropagation();
        if (!this.selected) {
            runInAction(() => this.selected = true);
            this.setFontColor("#000000");
            this.props.setSelected(this);
        }
    }

    deselect = action(() => {
        this.selected = false;
    });

    private setFontColor = action((color: string) => {
        this.color = color;
    })

    render() {
        const { name, private: isPrivate } = this.props.model;
        const marginTop = this.props.marginTop;
        const pending = marginTop === 0
        const border = pending ? "none" : `1px solid ${this.color}${this.selected ? "FF" : "55"}`;
        return (
            <div
                className={'repository'}
                onClick={this.select}
                onPointerEnter={() => !this.selected && this.setFontColor("#FF0000")}
                onPointerLeave={() => this.setFontColor("#000000")}
                style={{
                    marginTop,
                    marginLeft: pending ? 3 : marginTop,
                    marginRight: pending ? 3 : marginTop,
                    border,
                    cursor: isPrivate ? "normal" : "pointer",
                    color: this.color,
                    background: this.selected ? "rgb(255, 0, 0, 0.3)" : "white"
                }}
            >
                <div>{name}</div>
                {isPrivate && !pending ? <img
                    src={privateIcon}
                    width={40}
                    className={'private'}
                    title={'This repository is private'}
                    alt={'This repository is private'}
                /> : null}
            </div>
        );
    }

}
