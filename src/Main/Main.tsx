import React from 'react';
import "./Main.css";
import { observer } from "mobx-react";
import MenuBar from '../MenuBar/MenuBar';
import { action, observable } from 'mobx';
import { ColorScheme } from "../ColorScheme";
import Repositories from '../Repositories/Repositories';
import { ImageMapping, Downloads } from '../Assets/Assets';
import github from "../Assets/github.png";
import download from "../Assets/download.png"
import me from "../Assets/samw.png";
import Repository from '../Repositories/Repository';

interface LoadManager {
    MenuLoaded: boolean;
    RepositoriesLoaded: boolean;
}

@observer
export default class Main extends React.Component<{}> {
    private repositories = React.createRef<Repositories>();
    @observable private loadManager: LoadManager = {
        MenuLoaded: false,
        RepositoriesLoaded: false
    }
    @observable private currentPage = 1;
    @observable private selectedRepository: Repository | undefined = undefined;

    setSelected = action((repository: Repository | undefined) => {
        if (this.selectedRepository) {
            this.selectedRepository.deselect();
        }
        this.selectedRepository = repository;
    })

    onMenuLoaded = action(() => {
        this.loadManager.MenuLoaded = true;
        const { current } = this.repositories;
        current && current.populate();
    })

    onRepositoriesLoaded = action(() => {
        this.loadManager.RepositoriesLoaded = true;
    });

    openRepository = () => {
        if (this.selectedRepository) {
            this.selectedRepository.open()
        }
    }

    metaSpan = (url: string) => {
        return <div className={'meta-span'} onClick={() => window.open(url)}>{url}</div>
    }

    potentiallyDownloadable = () => {
        let downloadable = false;
        if (this.selectedRepository) {
            downloadable = Downloads.has(this.selectedRepository.id)
        }
        const image = (
            <img
                className={'link-button'}
                style={{
                    pointerEvents: "all",
                    top: 10,
                    right: 55,
                    opacity: this.selectedRepository ? downloadable ? 1 : 0.3 : 0,
                    transition: "0.5s opacity ease",
                    cursor: downloadable ? "pointer" : "default"
                }}
                src={download}
                title={"Download Content"}
                alt="Download Content"
            />
        );
        if (!downloadable) {
            return image;
        }
        return (
            <a href={`./downloads/${this.selectedRepository!.id}.dmg`}>
                {image}
            </a>
        );
    }

    render() {
        const { MenuLoaded, RepositoriesLoaded } = this.loadManager;
        const src = this.selectedRepository ? ImageMapping.get(this.selectedRepository.props.model.id) || github : github;
        let width = "70%";
        const noContent = src === github;
        if (noContent) {
            width = "30%";
        }
        const valid = !this.selectedRepository || !noContent;
        const border = valid ? "none" : "2px solid red";
        const borderRadius = noContent ? "50%" : undefined;
        const opacity = this.selectedRepository ? this.selectedRepository.isPrivate ? 0.3 : 1 : 0;
        const cursor = this.selectedRepository ? this.selectedRepository.isPrivate ? "default" : "pointer" : "default";
        return (
            <div
                className={'outermost'}
                style={{ background: MenuLoaded ? ColorScheme.primary : "white" }}
            >
                <MenuBar
                    onLoad={this.onMenuLoaded}
                    transitionDuration={1500}
                    currentPage={this.currentPage}
                    setCurrentPage={action((page: number) => {
                        this.currentPage = page;
                    })}
                />
                <div
                    className={"body"}
                    style={{
                        opacity: MenuLoaded ? 1 : 0,
                    }}
                >
                    <div className={'about'} style={{
                        opacity: this.currentPage === 0 ? 1 : 0,
                        pointerEvents: this.currentPage === 0 ? "all" : "none",
                        transition: "0.5s ease all"
                    }}>
                        <div className={'image-container profile'}>
                            <img
                                className={'profile-display'}
                                src={me}
                                alt="Profile"
                            />
                            <div className={'links'}>
                                <div>I stumbled on computer science as an undergraduate and haven't looked back. My favorite experiences through both coursework and independent research have included implementing systems-level projects in C, 2D game development in Java and a number of full stack applications with Javascript and Typescript / React clients served by Node and Java (Spark) servers. Going forward, I hope to explore initiatives and projects that exist in an industry setting, but are dedicated to enacting social and cultural change. In addition to being a San Francisco Bay Area native and a huge foodie, I enjoy staying active with soccer and golf. In both my free time and a variety of academic offerings, I've continued to explore my passion for songwriting, electronic music production and sound design.</div>
                                <br />
                                <div>Brown University, B.S. Computer Science</div>
                                <div>samwilkins333@gmail.com | samuel_wilkins@brown.edu</div>
                                <br />
                                {this.metaSpan("https://www.linkedin.com/in/sam-wilkins-173b09132")}
                                {this.metaSpan("https://github.com/samwilkins333")}
                                {this.metaSpan("http://dash-web.eastus2.cloudapp.azure.com:1050")}
                                {this.metaSpan("https://youtu.be/vljth0TdJzs")}
                                {this.metaSpan("https://youtu.be/DlDmES5S8Oo")}
                                {this.metaSpan("https://www.npmjs.com/package/array-batcher")}
                                {this.metaSpan("https://soundcloud.com/samandgrace")}
                                {this.metaSpan("https://soundcloud.com/swilks4")}
                            </div>
                        </div>
                    </div>
                    <div style={{
                        opacity: this.currentPage === 1 ? 1 : 0,
                        pointerEvents: this.currentPage === 1 ? "all" : "none",
                        transition: "0.5s ease all"
                    }}>
                        <div
                            className={'image-container'}
                            style={{
                                opacity: RepositoriesLoaded ? 1 : 0,
                            }}
                        >
                            <img
                                className={'link-button'}
                                onClick={this.openRepository}
                                style={{
                                    top: 10,
                                    right: 10,
                                    opacity,
                                    cursor,
                                    transition: "0.5s opacity ease"
                                }}
                                src={github}
                                title={"Navigate to Repository"}
                                alt="Navigate to Repository"
                            />
                            {this.potentiallyDownloadable()}
                            <img
                                className={"display"}
                                alt={"display"}
                                style={{ width, border, borderRadius, cursor: "pointer" }}
                                src={src}
                            />
                            {valid ? null : <span className={'unavailable'}>Content Unavailable</span>}
                        </div>
                        <Repositories
                            ref={this.repositories}
                            onLoad={this.onRepositoriesLoaded}
                            setSelected={this.setSelected}
                            currentPage={this.currentPage}
                        />
                    </div>
                </div>
            </div>
        );
    }

}