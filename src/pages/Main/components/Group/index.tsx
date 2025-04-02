import Icon from "@/components/Icon";
import Scrollbar from "@/components/Scrollbar";
import type { HistoryTablePayload } from "@/types/database";
import { Flex, Tag } from "antd";
import clsx from "clsx";
import { last } from "lodash-es";
import { MainContext } from "../..";

interface GroupItem extends Partial<HistoryTablePayload> {
	key: string;
	label: string;
	icon: string;
}

const Group = () => {
	const { state } = useContext(MainContext);
	const { t } = useTranslation();
	const [checked, setChecked] = useState("all");

	const groupList: GroupItem[] = [
		{
			key: "all",
			label: t("clipboard.label.tab.all"),
			icon: "i-iconamoon:menu-burger-horizontal",
		},
		{
			key: "text",
			label: t("clipboard.label.tab.text"),
			group: "text",
			icon: "i-iconamoon:type",
		},
		{
			key: "image",
			label: t("clipboard.label.tab.image"),
			group: "image",
			icon: "i-iconamoon:file-image",
		},
		{
			key: "file",
			label: t("clipboard.label.tab.files"),
			group: "files",
			icon: "i-iconamoon:file-document",
		},
		{
			key: "favorite",
			label: t("clipboard.label.tab.favorite"),
			favorite: true,
			icon: "i-iconamoon:star",
		},
		{
			key: "todo",
			label: "待办",
			favorite: true,
			icon: "i-iconamoon:check",
		},
	];

	useTauriFocus({
		onFocus() {
			if (!clipboardStore.window.showAll) return;

			handleChange(groupList[0]);
		},
	});

	useOSKeyPress("tab", () => {
		const index = groupList.findIndex((item) => item.key === checked);

		if (index === groupList.length - 1) {
			handleChange(groupList[0]);
		} else {
			handleChange(groupList[index + 1]);
		}
	});

	useOSKeyPress("shift.tab", () => {
		const index = groupList.findIndex((item) => item.key === checked);

		if (index === 0) {
			handleChange(last(groupList)!);
		} else {
			handleChange(groupList[index - 1]);
		}
	});

	const handleChange = (item: GroupItem) => {
		const { key, group, favorite } = item;

		setChecked(key);

		Object.assign(state, { group, favorite });
	};

	return (
		<Scrollbar thumbSize={0}>
			<Flex data-tauri-drag-region>
				{groupList.map((item) => {
					const { key, label, icon } = item;

					const isChecked = checked === key;

					return (
						<Tag.CheckableTag
							key={key}
							checked={isChecked}
							className={clsx({ "bg-primary!": isChecked })}
							onChange={() => handleChange(item)}
						>
							<Icon hoverable size={16} title={label} name={icon} />
						</Tag.CheckableTag>
					);
				})}
			</Flex>
		</Scrollbar>
	);
};

export default Group;
