import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowLeft, Loader, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const ForgotPasswordPage = () => {
	const [email, setEmail] = useState("");
	const [isSubmitted, setIsSubmitted] = useState(false);
	const { isLoading, forgotPassword } = useAuthStore();

	const handleSubmit = async (e) => {
		e.preventDefault();
		await forgotPassword(email);
		setIsSubmitted(true);
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className='max-w-md w-full bg-white bg-opacity-90 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden mx-auto mt-10'
		>
			<div className='p-8'>
				<h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-orange-500 to-orange-600 text-transparent bg-clip-text'>
					Mot de passe oublié ?
				</h2>

				{!isSubmitted ? (
					<form onSubmit={handleSubmit}>
						<p className='text-gray-700 mb-6 text-center'>
							Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
						</p>
						<div className='relative mb-4'>
							{/* Input field with the Mail icon inside */}
							<Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500' />
							<input
								className='w-full p-3 pl-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500'
								type='email'
								placeholder='Adresse email'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>
						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							className='w-full py-3 px-4 mt-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-lg shadow-lg hover:from-orange-600 hover:to-orange-700 focus:outline-none transition duration-200'
							type='submit'
						>
							{isLoading ? <Loader className='size-6 animate-spin mx-auto' /> : "Envoyer le lien"}
						</motion.button>
					</form>
				) : (
					<div className='text-center'>
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ type: "spring", stiffness: 500, damping: 30 }}
							className='w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4'
						>
							<Mail className='h-8 w-8 text-white' />
						</motion.div>
						<p className='text-gray-700 mb-6'>
							Si un compte existe pour <strong>{email}</strong>, vous recevrez un lien de réinitialisation sous peu.
						</p>
					</div>
				)}
			</div>

			<div className='px-8 py-4 bg-orange-600 bg-opacity-90 flex justify-center'>
				<Link to={"/"} className='text-sm text-white hover:underline flex items-center'>
					<ArrowLeft className='h-4 w-4 mr-2' /> Retour à la connexion
				</Link>
			</div>
		</motion.div>
	);
};

export default ForgotPasswordPage;
