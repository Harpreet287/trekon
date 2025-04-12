import { ArrowRightIcon } from '@heroicons/react/24/solid';

export default function TestButton() {
    return (
        <button className="p-4 bg-orange-500 text-white rounded-full flex items-center">
            Let's Get Started
            <ArrowRightIcon className="h-5 w-5 text-white ml-2" />
        </button>
    );
}