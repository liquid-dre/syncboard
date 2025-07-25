import { useState, useCallback } from "react"; // useCallback is good practice for memoizing 'fn'
import { toast } from "sonner";

// 1. Define types for the data, arguments, and error that the hook will handle.
//    These are generic parameters for flexibility.
//    D = Data type returned by the callback (cb)
//    A = Arguments type for the callback (cb)
interface UseFetchResult<D, A extends any[]> {
	// A extends any[] ensures it's an array type
	data: D | undefined;
	loading: boolean; // Changed from null to boolean
	error: Error | null; // Changed from null to Error | null
	fn: (...args: A) => Promise<void>; // fn will be async, returning void
	setData: React.Dispatch<React.SetStateAction<D | undefined>>;
}

// 2. Type the useFetch hook itself with generics
const useFetch = <D, A extends any[]>(
	// cb: The callback function. It's an async function taking args A and returning a Promise of D.
	cb: (...args: A) => Promise<D>
): UseFetchResult<D, A> => {
	const [data, setData] = useState<D | undefined>(undefined);
	const [loading, setLoading] = useState<boolean>(false); // Initialize with false, not null
	const [error, setError] = useState<Error | null>(null); // Initialize with null

	// useCallback memoizes the 'fn' function, preventing unnecessary re-renders
	// in consuming components if 'fn' is passed as a prop.
	const fn = useCallback(
		async (...args: A) => {
			// Type the rest parameter 'args'
			setLoading(true);
			setError(null); // Clear previous errors

			try {
				const response = await cb(...args);
				setData(response);
				// If response is successful, error should definitely be null.
				// setError(null); // This line is redundant if successful.
			} catch (err: unknown) {
				// Type the caught error as unknown
				// Type narrowing for the error object
				if (err instanceof Error) {
					setError(err);
					toast.error(err.message);
				} else if (typeof err === "string") {
					// Handle cases where a string is thrown
					const messageError = new Error(err);
					setError(messageError);
					toast.error(err); // Toast the string directly
				} else {
					// Handle any other unknown type of error
					const unknownError = new Error("An unexpected error occurred.");
					setError(unknownError);
					toast.error(unknownError.message);
				}
			} finally {
				setLoading(false);
			}
		},
		[cb]
	); // Dependency array includes 'cb' as it's used inside 'fn'

	return { data, loading, error, fn, setData };
};

export default useFetch;
