import { IoCheckmarkCircleOutline, IoEllipseOutline } from "react-icons/io5";

const RegisterSteps = ({step, classnames}) => {
    if (step === 'past') return <IoCheckmarkCircleOutline className={classnames}/>
    if (step === 'current') return <IoEllipseOutline className={classnames}/>
    if (step === 'future') return <IoEllipseOutline className={classnames}/>
}

export default RegisterSteps
