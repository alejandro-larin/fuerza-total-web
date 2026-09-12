const inputClass = "mt-1 h-11 w-full border border-[var(--line)] bg-white px-3";

export function Field({ label, name, type = "text", defaultValue, required = true, step }: { label: string; name: string; type?: string; defaultValue?: string | number; required?: boolean; step?: string }) {
  return <label className="text-sm font-semibold">{label}<input className={inputClass} name={name} type={type} defaultValue={defaultValue} required={required} step={step} /></label>;
}

export function SelectField({ label, name, options, defaultValue, required = true }: { label: string; name: string; options: Array<[string, string]>; defaultValue?: string; required?: boolean }) {
  return <label className="text-sm font-semibold">{label}<select className={inputClass} name={name} defaultValue={defaultValue} required={required}>{!required ? <option value="">Sin asignar</option> : null}{options.map(([value, text]) => <option key={value} value={value}>{text}</option>)}</select></label>;
}
