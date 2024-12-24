export interface Language {
    id: number;
    name: string;
    [property: string]: any;
}

export enum JudgeStatus {
    InQueue = 1,
    Processing = 2,
    Accepted = 3,
    WrongAnswer = 4,
    TimeLimitExceeded = 5,
    CompilationError = 6,
    RuntimeErrorSIGSEGV = 7,
    RuntimeErrorSIGXFSZ = 8,
    RuntimeErrorSIGFPE = 9,
    RuntimeErrorSIGABRT = 10,
    RuntimeErrorNZEC = 11,
    RuntimeErrorOther = 12,
    InternalError = 13,
    ExecFormatError = 14,
}

export const JudgeStatusString = {
    [JudgeStatus.InQueue]: "In Queue",
    [JudgeStatus.Processing]: "Processing",
    [JudgeStatus.Accepted]: "Accepted",
    [JudgeStatus.WrongAnswer]: "Wrong Answer",
    [JudgeStatus.TimeLimitExceeded]: "Time Limit Exceeded",
    [JudgeStatus.CompilationError]: "Compilation Error",
    [JudgeStatus.RuntimeErrorSIGSEGV]: "Runtime Error (SIGSEGV)",
    [JudgeStatus.RuntimeErrorSIGXFSZ]: "Runtime Error (SIGXFSZ)",
    [JudgeStatus.RuntimeErrorSIGFPE]: "Runtime Error (SIGFPE)",
    [JudgeStatus.RuntimeErrorSIGABRT]: "Runtime Error (SIGABRT)",
    [JudgeStatus.RuntimeErrorNZEC]: "Runtime Error (NZEC)",
    [JudgeStatus.RuntimeErrorOther]: "Runtime Error (Other)",
    [JudgeStatus.InternalError]: "Internal Error",
    [JudgeStatus.ExecFormatError]: "Exec Format Error"
}

export const JudgeStatusAbbr = {
    [JudgeStatus.InQueue]: "IQ",
    [JudgeStatus.Processing]: "PR",
    [JudgeStatus.Accepted]: "AC",
    [JudgeStatus.WrongAnswer]: "WA",
    [JudgeStatus.TimeLimitExceeded]: "TLE",
    [JudgeStatus.CompilationError]: "CE",
    [JudgeStatus.RuntimeErrorSIGSEGV]: "RE",
    [JudgeStatus.RuntimeErrorSIGXFSZ]: "RE",
    [JudgeStatus.RuntimeErrorSIGFPE]: "RE",
    [JudgeStatus.RuntimeErrorSIGABRT]: "RE",
    [JudgeStatus.RuntimeErrorNZEC]: "RE",
    [JudgeStatus.RuntimeErrorOther]: "RE",
    [JudgeStatus.InternalError]: "IE",
    [JudgeStatus.ExecFormatError]: "EFE"
}

export const JudgeStatusColor = {
    [JudgeStatus.InQueue]: "#FFFFFF",
    [JudgeStatus.Processing]: "#79BBFF",
    [JudgeStatus.Accepted]: "#67C23A",
    [JudgeStatus.WrongAnswer]: "#F56C6C",
    [JudgeStatus.TimeLimitExceeded]: "#E6A23C",
    [JudgeStatus.CompilationError]: "#337ECC",
    [JudgeStatus.RuntimeErrorSIGSEGV]: "#337ECC",
    [JudgeStatus.RuntimeErrorSIGXFSZ]: "#337ECC",
    [JudgeStatus.RuntimeErrorSIGFPE]: "#337ECC",
    [JudgeStatus.RuntimeErrorSIGABRT]: "#337ECC",
    [JudgeStatus.RuntimeErrorNZEC]: "#337ECC",
    [JudgeStatus.RuntimeErrorOther]: "#337ECC",
    [JudgeStatus.InternalError]: "#337ECC",
    [JudgeStatus.ExecFormatError]: "#337ECC"
}