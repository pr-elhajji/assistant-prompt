import { useState, useEffect } from 'react';
import { fetchAndParseData } from '../utils/markdownParser';

export const useMarkdownData = () => {
    const [data, setData] = useState({ params: {}, data: {}, warnings: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await fetchAndParseData();
                setData(result);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    return { ...data, loading, error };
};
