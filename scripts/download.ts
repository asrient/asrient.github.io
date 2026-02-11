import githubToProjects from './github';
import notionToBlogs from './notion';

(() => {
    console.log('<===========Downloading Files==============>');
    const tasks = [
        githubToProjects(),
        notionToBlogs(),
    ];
    tasks.forEach((task) => {
        task.catch((e) => {
            console.error('<===========Step Failed==============>');
            console.error(e);
        });
    });
    Promise.allSettled(tasks).finally(() => {
        console.log('<===========Download Completed==============>');
    });
})();
