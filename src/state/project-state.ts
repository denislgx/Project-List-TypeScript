namespace App {
  // Project State Management Class

  type Listener<T> = (items: T[]) => void;

  class State<T> {
    protected listeners: Listener<T>[] = []; // list of Fn that should be call whenever something changes

    addListener(listenerFunction: Listener<T>) {
      this.listeners.push(listenerFunction);
    }
  }

  export class ProjectState extends State<Project> {
    private projects: Project[] = [];
    private static instance: ProjectState;

    private constructor() {
      super();
    }

    static getInstance() {
      if (this.instance) {
        return this.instance;
      } else {
        this.instance = new ProjectState();
        return this.instance;
      }
    }

    addProject(title: string, description: string, numberOfPeople: number) {
      const newProject = new Project(
        Math.random().toString(),
        title,
        description,
        numberOfPeople,
        ProjectStatus.Active
      );
      this.projects.push(newProject);
      this.updateListeners();
      for (const listenersFn of this.listeners) {
        listenersFn(this.projects.slice());
      }
    }

    moveProject(projectId: string, newStatus: ProjectStatus) {
      const project = this.projects.find((project) => project.id === projectId);
      if (project && project.status !== newStatus) {
        project.status = newStatus;
        this.updateListeners();
      }
    }

    private updateListeners() {
      for (const listenersFn of this.listeners) {
        listenersFn(this.projects.slice());
      }
    }
  }

  export const projectState = ProjectState.getInstance();
}
