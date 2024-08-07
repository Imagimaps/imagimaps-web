import path from 'path';

const printActionHeader = (debug = false) => {
    console.log('=== Imagimaps Platform Action ===');
    console.log('Welcome to the Imagimaps platform action!');
    console.log('===================================');

    const requiredEnvVars = ['AWS_ACCOUNT_ID', 'AWS_REGION', 'TF_ENGINE'];
    const checkEnvVars = () => {
        const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
        if (missingEnvVars.length > 0) {
            console.error('Missing required environment variables:');
            missingEnvVars.forEach(varName => {
                console.error(varName);
            });
            return false;
        }
        return true;
    };
    const varsOk = checkEnvVars();

    if (debug) {
        console.log('Debug mode is enabled.');
        printEnvVariables();
        printNodejsVariables();
    }
    if (!varsOk) {
        throw new Error('Missing required environment variables.');
    }
};

const printEnvVariables = () => {
    console.log('=== Environment Variables ===');
    Object.keys(process.env).forEach(key => {
        console.log(`${key}: ${process.env[key]}`);
    });
    console.log('============================');
};

const printNodejsVariables = () => {
    console.log('=== Node.js Variables ===');
    console.log('========================');
};

export {
    printActionHeader,
    printEnvVariables,
    printNodejsVariables
};
