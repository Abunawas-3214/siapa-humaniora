import Header from "@/components/home-header";

export default function HomeLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="relative">
			<Header />
			<main>{children}</main>
		</div>
	)
}
