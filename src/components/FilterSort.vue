<template>
  <div>
    <div class="overlay" @click="close()"></div>
    <div class="filter-sort-container">
      <!-- Filter Nav bar-->
      <div class="filter-nav-bar">
        <div @click="close()">
            <BackArrow />
        </div>
        <div class="filter-nav-bar-title">Filter</div>
      </div>
      <!-- Filters and their values container -->
      <div
        class="fliter-options-value-container"
        v-if="selected_filter_option_index != undefined"
      >
        <!--Filters section -->
        <div class="filter-options-container">
          <div
            v-for="(filter_option, index) in filter_options"
            :key="index"
            class="filter-option"
            @click="changeSelectedFilterOption(filter_option.name, index)"
          >
            <div
              :class="{
                'selected-filter-option':
                  filter_option.name == activeFilterValue,
              }"
            >
              {{ filter_option.name }}
            </div>
          </div>
        </div>
        <!-- Values section -->
        <div
          class="filter-values"
          :key="`${filter_values?.length}+${selected_filter_option_index}`"
        >
          <div
            class="filter-value"
            v-for="(filter_value, index) in filter_values"
            :key="index"
            @click="selectFilterValue(filter_value, index)"
          >
            <div style="width: 24px; height: 24px">
              <img
                v-if="categoryImage(filter_value) || brandImage(filter_value)"
                :src="categoryImage(filter_value) || brandImage(filter_value)"
                alt=""
              />
            </div>
            <div>{{ filter_value.name }}</div>
            <!-- Condition to enable checkbox for required filters -->
            <div
              :key="`${index}-${checkbox_key}`"
              v-if="['Category'].includes(activeFilterValue)"
              class="checkbox-container"
              :class="{
                'checked-checkbox': showCheckedBoxes(filter_value.id),
              }"
            >
              <TickIcon />
            </div>
            <!-- Condition for Radio btn -->
            <div
              v-else
              class="checkbox-radio-btn"
              :class="{
                'checked-radio-btn': showCheckedBoxes(filter_value.id),
              }"
            >
              <span v-if="showCheckedBoxes(filter_value.id)"></span>
            </div>
          </div>
        </div>
      </div>
      <div class="button-bar">
        <button class="secondary-btn" @click="resetFilters()">Reset</button>
        <button class="primary-btn" @click="applyFilters()">Apply</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import TickIcon from '~/components/SVG/TickIcon.vue'
import BackArrow from '~/components/SVG/BackArrow.vue'
import {
  fetchBrandInfoByIds,
  getCategoriesByBrandId,
} from "~/utils/globalAPIs";
// import * as API from "../API/APIs.js";
// import { getReplacedSource } from "~/utils/helperMethods";

// import { getReplacedSource } from "@/customMethods/globalMethods";
const props = defineProps({
  brand_id: {
    type: String,
  },
  filter: {
    type: Object,
  },
  filter_type: {
    type: String,
  },
  options: {
    type: Array,
  },
  filterValues: {
    type: Object,
  },
});

const emits = defineEmits(["applyFilterAndFetch","closeFilter"]);
const router = useRouter();
const route = useRoute();
const checkbox_key = ref(0);
const selected_filter_option_index = ref(null);
const filter_options = ref([
  { name: "Category", selected_options: {} },
  { name: "Sort", selected_options: {} },
]);
const filter_values = ref([]);
const sort_values = ref([
  { id: 0, name: "Recommended", value: 0 },
  { id: -1, name: "Price High to Low", value: -1 },
  { id: 1, name: "Price Low to High", value: 1 },
]);

const activeFilterValue = computed(() => {
  return filter_options.value[selected_filter_option_index.value]?.name;
});
const changeSelectedFilterOption = async (option, index) => {
  if (option == "Brands") {
    var brandIds = [];
    await props.filterValues.forEach((val) => {
      if (val.key) {
        brandIds.push(val.key);
      }
    });
    if (brandIds?.length > 0) {
      filter_values.value = await fetchBrandInfoByIds(brandIds);
    }
  }
  if (option == "Category") {
    filter_values.value = await getCategoriesByBrandId(props.brand_id);
  }
  if (option == "Sort") {
    filter_values.value = sort_values.value;
  }
  nextTick(() => {
    selected_filter_option_index.value = index;
  });
};
onMounted(() => {
  selected_filter_option_index.value = 0;
  if (props.options) {
    filter_options.value = [...props.options];
  }
  filter_options.value.forEach((item, i) => {
    if (item.name == "Category" && props.filter?.category_lvl3?.length > 0) {
      props.filter.category_lvl3.forEach((ele, j) => {
        filter_options.value[i].selected_options[ele] = true;
      });
    }
    if (item.name == "Sort" && props.filter.sort != undefined) {
      filter_options.value[i].selected_options[props.filter.sort] = true;
    }
  });

  nextTick(() => {
    selected_filter_option_index.value = 0;
  });
  let i = filter_options.value.findIndex(
    (item) => item.name == props.filter_type
  );
  changeSelectedFilterOption(props.filter_type, i);
});
const close = () => {
  emits('closeFilter')
};
const resetFilters = () => {
  filter_options.value.forEach((item, i) => {
    filter_options.value[i].selected_options = {};
  });
};

const applyFilters = () => {
  let filter_body = {};
  filter_options.value.forEach((item, i) => {
    if (
      item.name == "Category" &&
      Object.keys(filter_options.value[i].selected_options).length > 0
    ) {
      filter_body["category_lvl3"] = Object.keys(
        filter_options.value[i].selected_options
      );
    }

    if (
      item.name == "Brands" &&
      Object.keys(filter_options.value[i].selected_options).length > 0
    ) {
      filter_body["brand_id"] = Object.keys(
        filter_options.value[i].selected_options
      );
    }

    if (
      item.name == "Sort" &&
      Object.keys(filter_options.value[i].selected_options).length > 0
    ) {
      let temp = Object.keys(filter_options.value[i].selected_options);
      filter_body["sort"] = parseInt(temp[0]);
    }
  });
  emits("applyFilterAndFetch", filter_body);
};
const showCheckedBoxes = (id) => {
  return !!filter_options.value[selected_filter_option_index.value]
    ?.selected_options[id];
};
const selectFilterValue = (filter_value) => {
  checkbox_key.value += 1;
  if (
    filter_options.value[selected_filter_option_index.value].name ==
      "Category" ||
    filter_options.value[selected_filter_option_index.value].name == "Brands"
  ) {
    if (
      !filter_options.value[selected_filter_option_index.value]
        .selected_options[filter_value.id]
    ) {
      filter_options.value[selected_filter_option_index.value].selected_options[
        filter_value.id
      ] = filter_value;
    } else {
      delete filter_options.value[selected_filter_option_index.value]
        .selected_options[filter_value.id];
    }
  }
  if (filter_options.value[selected_filter_option_index.value].name == "Sort") {
    let selected_sort = new Object();
    selected_sort[filter_value.id] = filter_value;

    filter_options.value[selected_filter_option_index.value].selected_options =
      selected_sort;
  }
};
const categoryImage = (category) => {
  let src = getReplacedSource(category?.level1_info?.thumbnail?.src);
  return src || null;
};
const brandImage = (brand) => {
  let src = getReplacedSource(brand?.logo?.src);
  return src || null;
};
</script>

<style scoped>
.overlay {
  background: rgba(0, 0, 0, 0.8);
  z-index: 101;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  pointer-events: none;
}
.filter-sort-container {
  background: rgb(255, 254, 254);
  z-index: 101;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(calc(-50%), calc(-50%));
  width: calc(100dvw - 64px);
  max-width: 480px;
  height: 80dvh;
  overflow: hidden;
  border-radius: 20px;
}

.filter-nav-bar-title {
  color: #13141b;
  font-family: Urbanist-Medium;
  font-size: 18px;
}

.filter-nav-bar {
  padding: 16px 11px;
  display: flex;
  gap: 16px;
  align-items: center;
}

.fliter-options-value-container {
  width: 100%;
  height: calc(100% - 164px);
  display: flex;
}

.filter-options-container {
  max-width: calc(100vw * 0.32);
  width: 100%;
  height: 100%;
  background: #f9f9f9;
  border-right: 1px solid #f5f5f5;
  border-top: 1px solid #f5f5f5;
  height: calc(100%);
  overflow-y: scroll;
}

.filter-option {
  padding: 0px 8px 0px 0px;
  color: #bebebe;
  cursor: pointer;
}

.filter-option > div {
  padding: 24px 16px;
  border: 1px solid #f5f5f5;
}

.selected-filter-option {
  background: #ffffff;
  color: #13141b;
}

.filter-values {
  border-bottom: #f5f5f5;
  padding: 16px;
  width: 100%;
  height: calc(100% - 32px);
  overflow-y: scroll;
}

.filter-value {
  display: grid;
  cursor: pointer;
  grid-template-columns: 1fr 6fr 1fr;
  align-items: center;
  padding: 16px 0;
  column-gap: 8px;
  border-bottom: 1px solid #f5f5f5;
}

.filter-value div {
  object-fit: cover;
}

.filter-value > div img {
  height: 24px;
  width: 24px;
}

.checkbox-container,
.checkbox-radio-btn {
  height: 24px;
  width: 24px;
  border-radius: 8px;
  border: 1px solid #eaeaea;
  justify-content: center;
  align-items: center;
  display: flex;
  box-sizing: border-box;
}

.checked-radio-btn {
  border: 2px solid#13141b;
}

.checkbox-radio-btn span {
  height: 8px;
  width: 8px;
  border-radius: 30%;
  background: #13141b;
}

.checked-checkbox {
  background: #13141b;
}

.button-bar {
  background: #fff;
  box-shadow: 0px -4px 13px 0px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-between;
  padding: 10px 16px 28px;
  align-items: center;
  gap: 10px;
  position: relative;
}

.secondary-btn,
.primary-btn {
  border: 1px solid #bebebe;
  border-radius: 12px;
  outline: none;
  background: #ffffff;
  color: #13141b;
  width: 100%;
  padding-bottom: 16px;
  padding-top: 16px;
  font-family: Urbanist-Bold;
  font-size: 16px;
  cursor: pointer;
}

.primary-btn {
  background: #fb6c23;
  color: #ffffff;
  outline: none;
  border: none;
}
@media screen and (max-width: 480px) and (min-width: 0) {
  .filter-sort-container {
    width: 100%;
    height: 100%;
    z-index: 101;
    position: fixed;
    top: 0;
    left: 0;
    transform: none;
    overflow: hidden;
    border-radius: 0;
  }
}
</style>