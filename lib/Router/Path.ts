export interface IPathPart {
    match(pathMatcher: PathMatcher): number;
}

export interface IMatchResult {
    isSuccess: boolean;
    score: number;
    data: Object;
}

export class PathMatcher {
    data: any;
    index: number;
    pathParts: string[];
    isCurrentMatchFailed: boolean;
    queryData: any = {};

    constructor(path: string) {
        let pathAndQuery = path.split('?');
        let queryString = pathAndQuery[1] || "";
        this.parseQueryString(queryString);
        path = pathAndQuery[0];
        this.pathParts = path.split('/');
        this.reset();
    }

    private parseQueryString(queryString: string): void {
        if (!queryString)
            return;
        let parts = queryString.split('&');
        parts.forEach(part => {
            let keyAndValue = part.split('=');
            let key = keyAndValue[0] && decodeURIComponent(keyAndValue[0]);
            let value = keyAndValue[1] && decodeURIComponent(keyAndValue[1]);
            this.queryData[key] = value;
        });
    }

    reset() {
        this.data = this.queryData;
        this.index = 0;
        this.isCurrentMatchFailed = false;
    }

    match(pathParts: Array<IPathPart>): IMatchResult {
        this.reset();
        let score = 0;
        for (var i = 0; i < pathParts.length; i++) {
            if (this.isCurrentMatchFailed)
                break;
            score += pathParts[i].match(this);
        }
        var result = {
            isSuccess: !this.isCurrentMatchFailed,
            score: score,
            data: this.data
        };
        this.reset();
        return result;
    }

    hasNextPart() {
        return this.index < this.pathParts.length;
    }

    nextPart() {
        return this.pathParts[this.index++];
    }

    fail() {
        this.isCurrentMatchFailed = true;
        this.data = {};
        return 0;
    }

    addData(key: string, value: any) {
        this.data[key] = value;
    }
}

export class Path {
    private parts: Array<IPathPart>;

    constructor(parts: Array<IPathPart>) {
        this.parts = parts;
    }

    match(pathMatcher: PathMatcher): IMatchResult {
        return pathMatcher.match(this.parts);
    }

    static parsePath(path: string): Path {
        let parts = path.split('/');
        let pathParts = <IPathPart[]>parts.map(part => {
            if (part[0] === ':') {
                return new ParameterPathPart(part);
            } else {
                return new ConstantPathPart(part);
            }
        });
        return new Path(pathParts);
    }
}

class ConstantPathPart implements IPathPart {
    private pathPart: string;

    constructor(part: string) {
        this.pathPart = part.toLowerCase();
    }

    match(pathMatcher: PathMatcher): number {
        if (!pathMatcher.hasNextPart())
            return pathMatcher.fail();
        var part = pathMatcher.nextPart();
        if (part.toLowerCase() !== this.pathPart)
            return pathMatcher.fail();
        return 1000;
    }
}

class ParameterPathPart implements IPathPart {
    private paramName: string;

    constructor(part: string) {
        this.paramName = part.replace(':', '');
    }

    match(pathMatcher: PathMatcher): number {
        if (!pathMatcher.hasNextPart())
            return pathMatcher.fail();
        var value = pathMatcher.nextPart();
        pathMatcher.addData(this.paramName, value);
        return 100;
    }
}