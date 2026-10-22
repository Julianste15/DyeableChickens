import { world, EquipmentSlot } from "@minecraft/server";

const DYE_COLORS = new Map([
  ["minecraft:orange_dye", 1],
  ["minecraft:magenta_dye", 2],
  ["minecraft:light_blue_dye", 3],
  ["minecraft:yellow_dye", 4],
  ["minecraft:lime_dye", 5],
  ["minecraft:pink_dye", 6],
  ["minecraft:gray_dye", 7],
  ["minecraft:light_gray_dye", 8],
  ["minecraft:cyan_dye", 9],
  ["minecraft:purple_dye", 10],
  ["minecraft:blue_dye", 11],
  ["minecraft:brown_dye", 12],
  ["minecraft:green_dye", 13],
  ["minecraft:red_dye", 14],
  ["minecraft:black_dye", 15],
  ["minecraft:white_dye", 16],
]);

function dyeChicken(player, target) {
  if (!target || target.typeId !== "minecraft:chicken") return;

  const equippable = player.getComponent("minecraft:equippable");
  if (!equippable) return;

  const held = equippable.getEquipment(EquipmentSlot.Mainhand);
  if (!held) return;

  const color = DYE_COLORS.get(held.typeId);
  if (color === undefined) return;

  let current;
  try {
    current = target.getProperty("dyeable:color");
  } catch (error) {
    return;
  }

  if (current === color) return;

  try {
    target.setProperty("dyeable:color", color);
  } catch (error) {
    return;
  }

  if (held.amount > 1) {
    held.amount -= 1;
    equippable.setEquipment(EquipmentSlot.Mainhand, held);
  } else {
    equippable.setEquipment(EquipmentSlot.Mainhand, undefined);
  }

  try {
    target.dimension.playSound("random.orb", target.location, { volume: 0.35, pitch: 1.5 });
  } catch (error) {}
}

world.afterEvents.playerInteractWithEntity.subscribe((event) => {
  dyeChicken(event.player, event.target);
});
