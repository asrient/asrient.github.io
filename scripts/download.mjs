import githubToProjects from './github.mjs';
import notionToBlogs from './notion.mjs';

(() => {
    console.log('<===========Downloading Files==============>');
    const tasks = [
        githubToProjects(),
        notionToBlogs(),
    ]
    tasks.forEach((task) => {
        task.catch((e) => {
            console.error('<===========Step Failed==============>')
            console.error(e);
        })
    });
    Promise.allSettled(tasks).finally(() => {
        console.log('<===========Download Completed==============>')
    })
})();
