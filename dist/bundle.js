var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("components/base-component", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Component = void 0;
    class Component {
        constructor(templateId, hostElementId, insertAtStart, newElementId) {
            this.templateElement = document.getElementById(templateId);
            this.hostElement = document.getElementById(hostElementId);
            const importNode = document.importNode(this.templateElement.content, true);
            this.element = importNode.firstElementChild;
            if (newElementId) {
                this.element.id = newElementId;
            }
            this.attach(insertAtStart);
        }
        attach(insertAtBeginning) {
            this.hostElement.insertAdjacentElement(insertAtBeginning ? "afterbegin" : "beforeend", this.element);
        }
    }
    exports.Component = Component;
});
define("util/validation", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validate = void 0;
    function validate(validatebleInput) {
        let isValid = true;
        if (validatebleInput.required) {
            isValid = isValid && validatebleInput.value.toString().trim().length !== 0;
        }
        if (validatebleInput.minLength != null &&
            typeof validatebleInput.value === "string") {
            isValid =
                isValid && validatebleInput.value.length >= validatebleInput.minLength;
        }
        if (validatebleInput.maxLength != null &&
            typeof validatebleInput.value === "string") {
            isValid =
                isValid && validatebleInput.value.length <= validatebleInput.maxLength;
        }
        if (validatebleInput.min != null &&
            typeof validatebleInput.min === "number") {
            isValid = isValid && validatebleInput.value >= validatebleInput.min;
        }
        if (validatebleInput.max != null &&
            typeof validatebleInput.max === "number") {
            isValid = isValid && validatebleInput.value <= validatebleInput.max;
        }
        return isValid;
    }
    exports.validate = validate;
});
define("decorator/autobind", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AutoBind = void 0;
    function AutoBind(_target, _methodName, descriptor) {
        const originalMethod = descriptor.value;
        const adjustedDescriptor = {
            configurable: true,
            enumerable: false,
            get() {
                const boundFn = originalMethod.bind(this);
                return boundFn;
            },
        };
        return adjustedDescriptor;
    }
    exports.AutoBind = AutoBind;
});
define("models/project", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Project = exports.ProjectStatus = void 0;
    var ProjectStatus;
    (function (ProjectStatus) {
        ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
        ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
    })(ProjectStatus = exports.ProjectStatus || (exports.ProjectStatus = {}));
    class Project {
        constructor(id, title, description, people, status) {
            this.id = id;
            this.title = title;
            this.description = description;
            this.people = people;
            this.status = status;
        }
    }
    exports.Project = Project;
});
define("state/project-state", ["require", "exports", "models/project"], function (require, exports, project_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.projectState = exports.ProjectState = void 0;
    class State {
        constructor() {
            this.listeners = [];
        }
        addListener(listenerFunction) {
            this.listeners.push(listenerFunction);
        }
    }
    class ProjectState extends State {
        constructor() {
            super();
            this.projects = [];
        }
        static getInstance() {
            if (this.instance) {
                return this.instance;
            }
            else {
                this.instance = new ProjectState();
                return this.instance;
            }
        }
        addProject(title, description, numberOfPeople) {
            const newProject = new project_js_1.Project(Math.random().toString(), title, description, numberOfPeople, project_js_1.ProjectStatus.Active);
            this.projects.push(newProject);
            this.updateListeners();
            for (const listenersFn of this.listeners) {
                listenersFn(this.projects.slice());
            }
        }
        moveProject(projectId, newStatus) {
            const project = this.projects.find((project) => project.id === projectId);
            if (project && project.status !== newStatus) {
                project.status = newStatus;
                this.updateListeners();
            }
        }
        updateListeners() {
            for (const listenersFn of this.listeners) {
                listenersFn(this.projects.slice());
            }
        }
    }
    exports.ProjectState = ProjectState;
    exports.projectState = ProjectState.getInstance();
});
define("components/project-input", ["require", "exports", "components/base-component", "util/validation", "decorator/autobind", "state/project-state"], function (require, exports, base_component_js_1, validation_js_1, autobind_js_1, project_state_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProjectInput = void 0;
    class ProjectInput extends base_component_js_1.Component {
        constructor() {
            super("project-input", "app", true, "user-input");
            this.titleInputElement = this.element.querySelector("#title");
            this.descriptionInputElement = this.element.querySelector("#description");
            this.peopleInputElement = this.element.querySelector("#people");
            this.configure();
        }
        gatherUserInput() {
            const enteredTitle = this.titleInputElement.value;
            const enteredDescription = this.descriptionInputElement.value;
            const enteredPeople = this.peopleInputElement.value;
            const titleValidatable = {
                value: enteredTitle,
                required: true,
            };
            const descriptionValidatable = {
                value: enteredDescription,
                required: true,
                minLength: 5,
            };
            const peopleValidatable = {
                value: +enteredPeople,
                required: true,
                min: 1,
                max: 5,
            };
            if (!validation_js_1.validate(titleValidatable) ||
                !validation_js_1.validate(descriptionValidatable) ||
                !validation_js_1.validate(peopleValidatable)) {
                alert("Invalid input! Please try again.");
            }
            else {
                return [enteredTitle, enteredDescription, +enteredPeople];
            }
        }
        configure() {
            this.element.addEventListener("submit", this.submitHandler);
        }
        clearInput() {
            this.titleInputElement.value = "";
            this.descriptionInputElement.value = "";
            this.peopleInputElement.value = "";
        }
        renderContent() { }
        submitHandler(event) {
            event.preventDefault();
            const userInput = this.gatherUserInput();
            if (Array.isArray(userInput)) {
                const [title, description, people] = userInput;
                project_state_js_1.projectState.addProject(title, description, people);
                this.clearInput();
            }
        }
    }
    __decorate([
        autobind_js_1.AutoBind
    ], ProjectInput.prototype, "submitHandler", null);
    exports.ProjectInput = ProjectInput;
});
define("models/drag-drop", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("components/project-item", ["require", "exports", "components/base-component", "decorator/autobind"], function (require, exports, base_component_js_2, autobind_js_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProjectItem = void 0;
    class ProjectItem extends base_component_js_2.Component {
        constructor(hostId, project) {
            super("single-project", hostId, false, project.id);
            this.project = project;
            this.configure();
            this.renderContent();
        }
        get persons() {
            if (this.project.people === 1) {
                return "1 person";
            }
            else {
                return `${this.project.people} persons`;
            }
        }
        dragStartHandler(event) {
            event.dataTransfer.setData("text/plain", this.project.id);
            event.dataTransfer.effectAllowed = "move";
        }
        dragEndHandler(_event) {
            console.log("DRAG END");
        }
        configure() {
            this.element.addEventListener("dragstart", this.dragStartHandler);
            this.element.addEventListener("dragend", this.dragEndHandler);
        }
        renderContent() {
            this.element.querySelector("h2").textContent = this.project.title;
            this.element.querySelector("h3").textContent =
                this.persons + " assigned to the project.";
            this.element.querySelector("p").textContent = this.project.description;
        }
    }
    __decorate([
        autobind_js_2.AutoBind
    ], ProjectItem.prototype, "dragStartHandler", null);
    exports.ProjectItem = ProjectItem;
});
define("components/project-list", ["require", "exports", "components/base-component", "models/project", "decorator/autobind", "state/project-state", "components/project-item"], function (require, exports, base_component_js_3, project_js_2, autobind_js_3, project_state_js_2, project_item_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProjectList = void 0;
    class ProjectList extends base_component_js_3.Component {
        constructor(type) {
            super("project-list", "app", false, `${type}-projects`);
            this.type = type;
            this.assignedProjects = [];
            this.configure();
            this.renderContent();
        }
        dragOverHandler(event) {
            if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
                event.preventDefault();
                const listElement = this.element.querySelector("ul");
                listElement.classList.add("droppable");
            }
        }
        dropHandler(event) {
            const projectId = event.dataTransfer.getData("text/plain");
            project_state_js_2.projectState.moveProject(projectId, this.type === "active" ? project_js_2.ProjectStatus.Active : project_js_2.ProjectStatus.Finished);
        }
        dragLeaveHandler(_event) {
            const listElement = this.element.querySelector("ul");
            listElement.classList.remove("droppable");
        }
        configure() {
            this.element.addEventListener("dragover", this.dragOverHandler);
            this.element.addEventListener("dragleave", this.dragLeaveHandler);
            this.element.addEventListener("drop", this.dropHandler);
            project_state_js_2.projectState.addListener((projects) => {
                const relevantProjects = projects.filter((project) => {
                    if (this.type === "active") {
                        return project.status === project_js_2.ProjectStatus.Active;
                    }
                    else {
                        return project.status === project_js_2.ProjectStatus.Finished;
                    }
                });
                this.assignedProjects = relevantProjects;
                this.renderProjects();
            });
        }
        renderContent() {
            const listId = `${this.type}-projects-list`;
            this.element.querySelector("ul").id = listId;
            this.element.querySelector("h2").textContent = `${this.type.toUpperCase()} PROJECTS`;
        }
        renderProjects() {
            console.log(this.element);
            const listElements = document.getElementById(`${this.type}-projects-list`);
            listElements.innerHTML = "";
            for (const projectItem of this.assignedProjects) {
                new project_item_js_1.ProjectItem(this.element.querySelector("ul").id, projectItem);
            }
        }
    }
    __decorate([
        autobind_js_3.AutoBind
    ], ProjectList.prototype, "dragOverHandler", null);
    __decorate([
        autobind_js_3.AutoBind
    ], ProjectList.prototype, "dropHandler", null);
    __decorate([
        autobind_js_3.AutoBind
    ], ProjectList.prototype, "dragLeaveHandler", null);
    exports.ProjectList = ProjectList;
});
define("app", ["require", "exports", "components/project-input", "components/project-list"], function (require, exports, project_input_js_1, project_list_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    new project_input_js_1.ProjectInput();
    new project_list_js_1.ProjectList("active");
    new project_list_js_1.ProjectList("finished");
});
//# sourceMappingURL=bundle.js.map