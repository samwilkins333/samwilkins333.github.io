import React from 'react';
import { observer } from "mobx-react";
import { observable, action } from "mobx";
import "./MenuBar.css";
import { ColorScheme } from '../ColorScheme';
import { Page } from '../Pages';

export interface MenuBarProps {
    onLoad: () => void;
    transitionDuration: number;
    currentPage: number;
    setCurrentPage: (page: number) => void;
}

@observer
export default class MenuBar extends React.Component<MenuBarProps> {
    @observable private textShiftExecuted = false;
    @observable private transitionExecuted = false;
    @observable private height = 0;
    @observable private expanded = false;
    @observable private interactive = false;

    componentDidMount() {
        const { transitionDuration, onLoad } = this.props;
        setTimeout(action(() => this.textShiftExecuted = true), transitionDuration * 2 / 3);
        setTimeout(action(() => {
            this.transitionExecuted = true;
            this.height = 60;
            onLoad();
        }), transitionDuration);
        setTimeout(action(() => {
            this.interactive = true;
            this.props.setCurrentPage(1);
        }), transitionDuration + 750);
    }

    private get currentPageTitle() {
        return Page[this.props.currentPage].title;
    }

    showOthers = () => {
        if (!this.expanded) {
            return (null);
        }
        return (
            <div className={'menu-items heading'}>
                {Object.values(Page).filter(page => page.title !== this.currentPageTitle).map(page => (
                    <div
                        className={'page'}
                        key={page.title}
                        onClick={() => this.props.setCurrentPage(Object.values(Page).indexOf(page))}
                    >{page.title}</div>
                ))}
            </div>
        )
    }

    render() {
        const title = (
            <span
                className={'samwilkins'}
                style={{ color: this.transitionExecuted ? "white" : ColorScheme.samwilkins }}
            >
                {`{ ${this.interactive ? this.currentPageTitle : 'samwilkins.me'} }`}
            </span>
        );
        return (
            <div
                className={'container'}
                style={{
                    height: this.expanded ? window.screen.availHeight : this.height,
                }}
                onClick={action(() => this.expanded = !this.expanded)}
            >
                <div
                    className={'import-phrase'}
                    style={{ left: this.textShiftExecuted ? -85 : 20 }}
                >
                    <span className={'heading'}>
                        <span style={{ transition: "0.5s opacity ease", opacity: this.transitionExecuted ? 0 : 1 }}>import</span> {title} <span style={{ transition: "0.5s opacity ease", opacity: this.transitionExecuted ? 0 : 1 }}>from react-typescript</span></span>
                </div>
                <div className={'white-hr'} style={{ opacity: this.expanded ? 0.5 : 0 }}></div>
                {this.showOthers()}
            </div>
        )
    }

}