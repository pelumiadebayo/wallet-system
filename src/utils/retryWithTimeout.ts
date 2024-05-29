export async function retryWithTimeout<T>(
    operation: () => Promise<T>,
    retries: number = 5,
    delay: number = 1000,
    factor: number = 2,
    timeout: number = 5000
): Promise<T> {
    let attempt = 0;

    const executeOperation = async (): Promise<T> => {
        return new Promise<T>(async (resolve, reject) => {
            const timer = setTimeout(() => reject(new Error('Operation timed out')), timeout);

            try {
                const result = await operation();
                clearTimeout(timer);
                resolve(result);
            } catch (error) {
                clearTimeout(timer);
                reject(error);
            }
        });
    };

    while (attempt < retries) {
        try {
            return await executeOperation();
        } catch (error) {
            if (attempt < retries - 1) {
                await new Promise(res => setTimeout(res, delay * Math.pow(factor, attempt)));
            } else {
                throw error;
            }
        }
        attempt++;
    }

    throw new Error('Max retries reached');
}
